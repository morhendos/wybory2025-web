'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface RegionalData {
  region: string
  totalAnomaly: number
  commissionsAffected: number
}

interface RegionalBarChartProps {
  data: RegionalData[]
  width?: number
  height?: number
}

export function RegionalBarChart({ 
  data, 
  width = 800, 
  height = 400 
}: RegionalBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 100, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Sort data by totalAnomaly (most negative first)
    const sortedData = [...data].sort((a, b) => a.totalAnomaly - b.totalAnomaly)

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(sortedData.map(d => d.region))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([d3.min(sortedData, d => d.totalAnomaly) || 0, 0])
      .nice()
      .range([innerHeight, 0])

    // Color scale
    const colorScale = d3.scaleSequential()
      .domain([0, Math.abs(d3.min(sortedData, d => d.totalAnomaly) || 0)])
      .interpolator(d3.interpolateReds)

    // Create axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => d3.format(',.0f')(d))

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')

    // Add Y axis
    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text('Całkowita anomalia (głosy)')

    // Add zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#666')
      .attr('stroke-width', 1)

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

    // Add bars
    g.selectAll('.bar')
      .data(sortedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.region) || 0)
      .attr('y', d => d.totalAnomaly < 0 ? yScale(0) : yScale(d.totalAnomaly))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.totalAnomaly < 0 ? colorScale(Math.abs(d.totalAnomaly)) : '#3b82f6')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8)
        tooltip.style('visibility', 'visible')
          .html(`
            <strong>${d.region}</strong><br>
            Anomalia: ${Math.round(d.totalAnomaly).toLocaleString()} głosów<br>
            Komisje: ${d.commissionsAffected}
          `)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1)
        tooltip.style('visibility', 'hidden')
      })
      .transition()
      .duration(800)
      .attr('y', d => d.totalAnomaly < 0 ? yScale(d.totalAnomaly) : yScale(0))
      .attr('height', d => Math.abs(yScale(d.totalAnomaly) - yScale(0)))

    // Add value labels on bars
    g.selectAll('.label')
      .data(sortedData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => (xScale(d.region) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.totalAnomaly) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text(d => Math.round(d.totalAnomaly).toLocaleString())
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)

    // Clean up tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove()
    }

  }, [data, width, height])

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  )
}