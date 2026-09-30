import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, iconColor, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className={cn("p-2 rounded-lg", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-3 mt-4">
          <h2 className="text-3xl font-bold text-gray-600">{value}</h2>
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend.isPositive ? "text-success" : "text-danger"
          )}>
            {trend.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {Math.abs(trend.value)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
