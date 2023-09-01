import { WidgetTitle } from '@/components/Widget/Title';
import { Select, SelectItem } from '@ossinsight/ui';

export function QuickSelector ({ type, widgets, widget, setWidget }: { type: 'repo' | 'user', widgets: string[], widget: string | undefined, setWidget (widget: string | undefined): void }) {
  return (
    <Select
      id="widget-selector"
      value={widget}
      onValueChange={setWidget}
      placeholder="Select a widget..."
      position="popper"
      renderValue={widget => (
        <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                <WidgetTitle widget={widget} />
              </span>
      )}
    >
      {widgets.map(widget => (
        <SelectItem value={widget} key={widget}>
          <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
            <WidgetTitle widget={widget} />
          </span>
        </SelectItem>
      ))}
    </Select>
  );
}