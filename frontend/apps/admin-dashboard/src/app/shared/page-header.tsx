import cn from "@core/utils/class-names";
import Breadcrumb from "@core/ui/breadcrumb";

export type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function PageHeader({
  title,
  breadcrumb,
  children,
  className,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header
      className={cn("@container xs:-mt-2 -mt-2", className)}
      style={{ background: "#e2e4e5" }}
    >
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between h-[80px]">
        <div className="p-6">
          <h2 className="mb-2 text-[20px] mt-12">{title}</h2>

          <Breadcrumb
            separator=""
            separatorVariant="circle"
            className="flex-wrap"
          >
            {breadcrumb.map((item) => (
              <Breadcrumb.Item
                key={item.name}
                {...(item?.href && { href: item?.href })}
              >
                {item.name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        {children}
      </div>
    </header>
  );
}
