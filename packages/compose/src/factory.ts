import { BuiltinWidgetsMap } from '@ossinsight/widgets-core/src/renderer/builtin-widgets';
import { isEmptyData } from '@ossinsight/widgets-core/src/utils/datasource';
import { FlexBaseLayout, GridLayout, Layout, WidgetLayout } from '@ossinsight/widgets-utils/src/compose';

function Compose (component: any, props: any, ...children: any): Layout {
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

  // flatten children to a single array and remove falsy values.
  children = children.filter(Boolean).flatMap(child => child);

  if (typeof component === 'function') {
    return component({ ...props, children });
  }

  const key = component;

  return {
    layout: key,
    ...restProps,
    data: key === 'widget' ? data : undefined,
    padding,
    gap,
    size,
    grow,
    children,
  } as Layout;
}

namespace Compose {
  export type ComposeNodes = Layout | undefined | null | false | ComposeNodes[];
  export type FC<P> = (props: P) => Layout;

  export namespace JSX {
    type LayoutChildrenAttributes = { children?: ComposeNodes };
    export type CommonAttributes = Pick<Layout, 'gap' | 'size' | 'padding' | 'grow'>;
    export type LayoutAttributes<L extends Layout> = Omit<L, 'layout' | 'children'>;

    export type Element = Layout;

    export type IntrinsicAttributes = { data?: any, ifEmpty?: 'hide' | 'indicator' };

    export interface ElementChildrenAttribute {
      children: ComposeNodes;
    }

    export interface IntrinsicElements {
      flex: LayoutAttributes<FlexBaseLayout> & LayoutChildrenAttributes & IntrinsicAttributes;
      grid: LayoutAttributes<GridLayout> & LayoutChildrenAttributes & IntrinsicAttributes;
      widget: LayoutAttributes<WidgetLayout> & IntrinsicAttributes;
    }
  }
}

type BuiltinWidgetDefinitions = {
  [K in keyof BuiltinWidgetsMap]: {
    isPrivate: true,
    params: BuiltinWidgetsMap[K]
  }
}

declare module '@ossinsight/internal/widgets' {
  interface WidgetsDefinitions extends BuiltinWidgetDefinitions {
  }
}

export default Compose;