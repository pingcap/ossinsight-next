import { BuiltinWidgetsMap } from '@ossinsight/widgets-core/src/renderer/builtin-widgets';
import { isEmptyData } from '@ossinsight/widgets-core/src/utils/datasource';
import { FlexBaseLayout, GridLayout, Layout, WidgetLayout } from '@ossinsight/widgets-utils/src/compose';

function Compose(component: any, props: any, ...children: any): Layout {
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
    console.log(children)
    return component({ ...props, children });
  }

  const key = component;

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
      children,
    } as Layout;
  }
}

namespace Compose {
  export type ComposeNodes = Layout | undefined | null | false | ComposeNodes[];

  export namespace JSX {
    type LayoutChildrenAttributes = { children: ComposeNodes };
    type CommonAttributes  = Pick<Layout, 'gap' | 'size' | 'padding' | 'grow'>;
    type LayoutAttributes<L extends Layout> = Omit<L, 'layout' | 'children'>;

    export type Element = Layout;

    export type IntrinsicAttributes = { data?: any, ifEmpty?: 'hide' | 'indicator' };

    export interface ElementChildrenAttribute {
      children: {};
    }

    export interface IntrinsicElements extends BuiltinWidgets {
      flex: LayoutAttributes<FlexBaseLayout> & LayoutChildrenAttributes & IntrinsicAttributes;
      grid: LayoutAttributes<GridLayout> & LayoutChildrenAttributes & IntrinsicAttributes;
      widget: LayoutAttributes<WidgetLayout> & IntrinsicAttributes
    }

    // MARK: React does not support namespace
    export interface BuiltinWidgets {
      'builtin-empty': BuiltinWidgetsMap['builtin:empty'] & CommonAttributes;
      'builtin-label': BuiltinWidgetsMap['builtin:label'] & CommonAttributes;
      'builtin-label-value': BuiltinWidgetsMap['builtin:label-value'] & CommonAttributes;
      'builtin-avatar-label': BuiltinWidgetsMap['builtin:avatar-label'] & CommonAttributes;
      'builtin-avatar-progress': BuiltinWidgetsMap['builtin:avatar-progress'] & CommonAttributes;
      'builtin-card-heading': BuiltinWidgetsMap['builtin:card-heading'] & CommonAttributes;
    }
  }
}

export default Compose;