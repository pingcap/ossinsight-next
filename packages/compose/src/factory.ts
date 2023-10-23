import { BuiltinWidgetsMap } from '@ossinsight/widgets-core/src/renderer/builtin-widgets';
import { isEmptyData } from '@ossinsight/widgets-core/src/utils/datasource';
import { FlexBaseLayout, GridLayout, Layout, WidgetLayout } from '@ossinsight/widgets-utils/src/compose';

function Compose<K extends keyof Compose.JSX.IntrinsicElements> (key: K, props: any, ...children: any): Layout {
  const { padding = 0, gap = 0, size = undefined, grow = undefined, data, ifEmpty, ...restProps } = props;
  if (ifEmpty) {
    if (isEmptyData(data)) {
      if (ifEmpty === 'indicator') {
        return {
          layout: 'widget',
          widget: 'builtin:empty',
          data: {},
          parameters: undefined,
          children: [],
        };
      } else {
        return null;
      }
    }
  }

  if (key.startsWith('builtin-')) {
    return {
      layout: 'widget',
      widget: key.replace(/^builtin-/, 'builtin:'),
      parameters: restProps,
      data,
      children: [],
      padding,
      gap,
      size,
      grow,
    };
  } else {
    return {
      layout: key,
      ...restProps,
      data: key === 'widget' ? data : undefined,
      padding,
      gap,
      size,
      grow,
      children: children.filter(Boolean),
    } as Layout;
  }
}

namespace Compose {
  export namespace JSX {
    type Nodes = Layout | Layout[] | undefined | null | false;
    type LayoutChildrenAttributes = { children: Nodes };
    type LayoutAttributes<L extends Layout> = Omit<L, 'layout' | 'children'> & IntrinsicAttributes;

    export type Element = Layout;

    export type IntrinsicAttributes = Pick<Layout, 'gap' | 'size' | 'padding' | 'grow'> & { data?: any, ifEmpty?: 'hide' | 'indicator' };

    export interface ElementChildrenAttribute {
      children: {};
    }

    export interface IntrinsicElements extends BuiltinWidgets {
      flex: LayoutAttributes<FlexBaseLayout> & LayoutChildrenAttributes;
      grid: LayoutAttributes<GridLayout> & LayoutChildrenAttributes;
      widget: LayoutAttributes<WidgetLayout>
    }

    // MARK: React does not support namespace
    export interface BuiltinWidgets {
      'builtin-empty': BuiltinWidgetsMap['builtin:empty'] & IntrinsicAttributes;
      'builtin-label': BuiltinWidgetsMap['builtin:label'] & IntrinsicAttributes;
      'builtin-label-value': BuiltinWidgetsMap['builtin:label-value'] & IntrinsicAttributes;
      'builtin-avatar-label': BuiltinWidgetsMap['builtin:avatar-label'] & IntrinsicAttributes;
      'builtin-avatar-progress': BuiltinWidgetsMap['builtin:avatar-progress'] & IntrinsicAttributes;
      'builtin-card-heading': BuiltinWidgetsMap['builtin:card-heading'] & IntrinsicAttributes;
    }
  }
}

export default Compose;