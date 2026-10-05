import { Skeleton } from '@ui/Skeleton';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri'];
const MEAL_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

export function MenuImportSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-[18px]">
        <Skeleton className="w-56 h-9 rounded-[9px]" />
        <Skeleton className="w-24 h-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-[22px]">
        {DAY_KEYS.map((k) => (
          <div
            key={k}
            className="bg-paper border border-rule rounded-[12px] px-4 py-[14px] flex flex-col gap-3"
          >
            <Skeleton className="w-16 h-3.5" />
            <Skeleton className="w-full h-[5px]" />
            <Skeleton className="w-20 h-2.5" />
          </div>
        ))}
      </div>

      <div className="border border-rule rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  aria-label="Tipo de comida"
                  className="bg-olive-50 border-b border-r border-rule px-4 py-3 min-w-[128px]"
                />
                {DAY_KEYS.map((k) => (
                  <th
                    key={k}
                    className="bg-olive-50 border-b border-l border-cream-2 px-4 py-[13px] text-center min-w-[130px]"
                  >
                    <Skeleton className="w-16 h-3.5 mx-auto mb-1.5" />
                    <Skeleton className="w-10 h-2.5 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_KEYS.map((k) => (
                <tr key={k} className="border-t border-cream-2">
                  <td className="bg-menu-sticky-bg sticky left-0 z-10 px-4 py-3.5 border-r border-rule">
                    <Skeleton className="w-20 h-2.5" />
                  </td>
                  {DAY_KEYS.map((d) => (
                    <td key={d} className="bg-paper border-l border-cream-2 px-[11px] py-[9px]">
                      <Skeleton className="w-full h-3" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
