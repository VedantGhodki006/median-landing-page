import { cn } from "@/lib/utils";
import { mockup } from "@/lib/content";
import { StatusChip } from "../StatusChip";

export function SourcesTable() {
  const { sources } = mockup;
  return (
    <div className="px-5 py-4">
      <p className="text-[12.5px] font-medium text-fg">{sources.title}</p>
      <table className="mt-3 w-full text-left text-[11.5px]">
        <thead>
          <tr className="text-faint">
            {sources.columns.map((c, i) => (
              <th
                key={c}
                className={cn(
                  "border-b border-line pb-2 font-normal",
                  i === 3 && "pl-4"
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.rows.map((r) => (
            <tr key={r.source} className="border-b border-line last:border-b-0">
              <td className="py-2 text-fg">{r.source}</td>
              <td className="py-2 text-muted-fg">{r.how}</td>
              <td className="py-2 text-muted-fg">{r.updated}</td>
              <td className="py-2 pl-4">
                <StatusChip tone={r.tone} label={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
