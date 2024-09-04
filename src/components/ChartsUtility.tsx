import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const RadialChartComponent = ({ totalSize }: { totalSize: number }) => (
  <Card className="flex flex-col">
    <CardHeader className="items-center pb-0">
      <CardTitle>Storage Usage</CardTitle>
      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <div className="mx-auto aspect-square max-h-[250px]">
        <RadialBarChart
          width={250}
          height={250}
          innerRadius={70}
          outerRadius={100}
          data={[{ name: 'Used Space', value: totalSize }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarGrid />
          <RadialBar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            background
            cornerRadius={10}
          />
          <PolarRadiusAxis tick={false} />
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalSize.toLocaleString()} GB
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
              return null;
            }}
          />
        </RadialBarChart>
      </div>
    </CardContent>
    <CardFooter className="text-sm">
      <div className="leading-none text-muted-foreground">
        Showing total space used
      </div>
    </CardFooter>
  </Card>
);


const PieChartComponent = ({ fileTypeData }: { fileTypeData: { type: string; size: number }[] }) => (
  <Card className="flex flex-col">
    <CardHeader className="items-center pb-0">
      <CardTitle>File Type Distribution</CardTitle>
      <CardDescription>Overview of file types used</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <div className="mx-auto aspect-square max-h-[250px]">
        <PieChart width={250} height={250}>
          <Pie
            data={fileTypeData}
            dataKey="size"
            nameKey="type"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={5}
            labelLine={false}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const totalSize = fileTypeData.reduce((acc, curr) => acc + curr.size, 0);
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
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalSize.toLocaleString()} 
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Size
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </div>
    </CardContent>
    <CardFooter className="text-sm">
      <div className="leading-none text-muted-foreground">
        Showing distribution of file types
      </div>
    </CardFooter>
  </Card>
);


export { RadialChartComponent, PieChartComponent };
