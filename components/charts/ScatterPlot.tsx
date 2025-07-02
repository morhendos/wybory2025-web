'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ScatterPoint {
  leaningScore: number
  anomalyInVotes: number
  voivodeship?: string
  county?: string
}

interface ScatterPlotProps {
  data: ScatterPoint[]
  width?: number
  height?: number
  highlightThreshold?: number
}

export function ScatterPlot({ 
  data, 
  width = 800, 
  height = 400,
  highlightThreshold = -50 
}: ScatterPlotProps) {
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

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.anomalyInVotes) as [number, number])
      .nice()
      .range([innerHeight, 0])

    // Color scale for anomaly severity
    const colorScale = d3.scaleSequential()
      .domain([0, Math.abs(d3.min(data, d => d.anomalyInVotes) || 0)])
      .interpolator(d3.interpolateReds)

    // Create axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Leaning Score')

    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Anomalia (głosy)')

    // Add zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '3,3')

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('font-size', '12px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')

    // Add scatter points
    g.selectAll('.point')
      .data(data)
      .enter().append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.leaningScore))
      .attr('cy', d => yScale(d.anomalyInVotes))
      .attr('r', d => d.anomalyInVotes < highlightThreshold ? 5 : 3)
      .attr('fill', d => d.anomalyInVotes < 0 ? colorScale(Math.abs(d.anomalyInVotes)) : '#3b82f6')
      .attr('opacity', d => d.anomalyInVotes < highlightThreshold ? 0.8 : 0.5)
      .attr('stroke', d => d.anomalyInVotes < highlightThreshold ? '#dc2626' : 'none')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        tooltip.style('visibility', 'visible')
          .html(`
            <strong>${d.voivodeship || 'Nieznane'}</strong><br>
            ${d.county || ''}<br>
            Anomalia: ${Math.round(d.anomalyInVotes)} głosów<br>
            Leaning: ${d.leaningScore.toFixed(2)}
          `)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px')
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden')
      })

    // Clean up tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove()
    }

  }, [data, width, height, highlightThreshold])

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  )
}