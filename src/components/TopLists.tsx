'use client';

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

export default function TopLists({ title, data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-neutral-200 text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-4">
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <li key={item.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400 truncate pr-2">{item.name}</span>
                <span className="text-neutral-200 font-medium tabular-nums">{item.value}</span>
              </div>
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
