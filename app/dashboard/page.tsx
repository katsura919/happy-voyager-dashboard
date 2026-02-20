import { CustomerWidget } from "@/components/dashboard/widgets/customer-widget";
import { ProductDotWidget } from "@/components/dashboard/widgets/product-dot-widget";
import { ProductPillWidget } from "@/components/dashboard/widgets/product-pill-widget";
import { CategoryBarChartWidget } from "@/components/dashboard/widgets/bar-chart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
      {/* Left Column (Stats + Pill Chart) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
          <CustomerWidget />
          <ProductDotWidget />
        </div>

        {/* Bottom Large Chart */}
        <div className="flex-1 min-h-[350px]">
          <ProductPillWidget />
        </div>
      </div>

      {/* Right Column (Category Chart) */}
      <div className="lg:col-span-7 h-full min-h-[600px] lg:min-h-auto">
        <CategoryBarChartWidget />
      </div>
    </div>
  );
}
