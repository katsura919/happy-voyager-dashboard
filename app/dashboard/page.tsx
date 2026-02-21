import { CustomerWidget } from "@/components/dashboard/widgets/customer-widget";
import { ProductDotWidget } from "@/components/dashboard/widgets/product-dot-widget";
import { ProductPillWidget } from "@/components/dashboard/widgets/product-pill-widget";
import { CategoryBarChartWidget } from "@/components/dashboard/widgets/bar-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <CustomerWidget />
        <ProductDotWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Category Chart) */}
        <div className="lg:col-span-7 h-full min-h-[400px]">
          <CategoryBarChartWidget />
        </div>

        {/* Right Column (Pill Chart) */}
        <div className="lg:col-span-5 h-full min-h-[400px]">
          <ProductPillWidget />
        </div>
      </div>
    </div>
  );
}
