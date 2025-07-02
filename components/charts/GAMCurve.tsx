'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
  leaningScore: number
  residual: number
  GAMPrediction: number
  confidenceInterval: {
    lower: number
    upper: number
  }
}

interface GAMCurveProps {
  data: DataPoint[]
  width?: number
  height?: number
  showPoints?: boolean
}

export function GAMCurve({ 
  data, 
  width = 800, 
  height = 400,
  showPoints = false 
}: GAMCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth])

    const yExtent = d3.extent([
      ...data.map(d => d.GAMPrediction),
      ...data.map(d => d.confidenceInterval.lower),
      ...data.map(d => d.confidenceInterval.upper)
    ]) as [number, number]

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .nice()
      .range([innerHeight, 0])

    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d3.format('.1f')(d))

    const yAxis = d3.axisLeft(yScale)
      .ticks(8)
      .tickFormat(d => d3.format('.0f')(d))

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Leaning Score (0 = anty-RT, 1 = pro-RT)')

    // Add Y axis
    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Niewyjaśniona anomalia (głosy)')

    // Add zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.7)

    // Sort data by leaning score for proper line drawing
    const sortedData = [...data].sort((a, b) => a.leaningScore - b.leaningScore)

    // Create confidence interval area
    const areaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.leaningScore))
      .y0(d => yScale(d.confidenceInterval.lower))
      .y1(d => yScale(d.confidenceInterval.upper))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(sortedData)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.2)
      .attr('d', areaGenerator)

    // Create GAM prediction line
    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.leaningScore))
      .y(d => yScale(d.GAMPrediction))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('d', lineGenerator)

    // Add scatter points if requested
    if (showPoints && data.length < 500) {
      g.selectAll('.point')
        .data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', d => xScale(d.leaningScore))
        .attr('cy', d => yScale(d.residual))
        .attr('r', 2)
        .attr('fill', '#666')
        .attr('opacity', 0.3)
    }

    // Add annotations for key findings
    const minPrediction = d3.min(sortedData, d => d.GAMPrediction) || 0
    const maxPrediction = d3.max(sortedData, d => d.GAMPrediction) || 0

    // Annotation for negative anomalies
    if (minPrediction < -10) {
      const minPoint = sortedData.find(d => d.GAMPrediction === minPrediction)
      if (minPoint) {
        g.append('text')
          .attr('x', xScale(minPoint.leaningScore))
          .attr('y', yScale(minPrediction) - 10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#dc2626')
          .text(`Największa anomalia: ${Math.round(minPrediction)} głosów`)
      }
    }

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 200}, 20)`)

    legend.append('rect')
      .attr('width', 180)
      .attr('height', 60)
      .attr('fill', 'white')
      .attr('stroke', '#ccc')
      .attr('rx', 4)

    legend.append('line')
      .attr('x1', 10)
      .attr('x2', 40)
      .attr('y1', 20)
      .attr('y2', 20)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)

    legend.append('text')
      .attr('x', 45)
      .attr('y', 25)
      .style('font-size', '12px')
      .text('Krzywa GAM')

    legend.append('rect')
      .attr('x', 10)
      .attr('y', 35)
      .attr('width', 30)
      .attr('height', 15)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.2)

    legend.append('text')
      .attr('x', 45)
      .attr('y', 47)
      .style('font-size', '12px')
      .text('95% przedział ufności')

  }, [data, width, height, showPoints])

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  )
}