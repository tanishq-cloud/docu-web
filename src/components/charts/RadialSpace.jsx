"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label,
} from "recharts";

const calculateSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes < 1024 * 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
};

export function RadialChart({ usedSpace, totalSpace }) {
  const [chartData, setChartData] = useState([
    { name: "Used", value: usedSpace, fill: "#4f46e5" },
    { name: "Remaining", value: totalSpace - usedSpace, fill: "#e5e7eb" },
  ]);

  useEffect(() => {
    setChartData([
      { name: "Used", value: usedSpace, fill: "#4f46e5" },
      { name: "Remaining", value: totalSpace - usedSpace, fill: "#e5e7eb" },
    ]);
  }, [usedSpace, totalSpace]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Storage Usage</CardTitle>
        <CardDescription>
          {calculateSize(usedSpace)} / {calculateSize(totalSpace)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={360}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
          />
          <RadialBar
            dataKey="value"
            background
            cornerRadius={10}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {calculateSize(usedSpace)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Used Space
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </CardContent>
    </Card>
  );
}

