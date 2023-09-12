import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { upperFirst } from '@ossinsight/widgets-utils/src/utils';

const generateMetadata: MetadataGenerator<{
  owner_id: string;
  activity: string;
  period: string;
}> = ({ parameters: { owner_id, activity, period }, getOrg }) => {
  const org = getOrg(Number(owner_id));

  return {
    title: `${upperFirst(activity)} participants of ${org.login} - ${period
      .split('_')
      .join(' ')}`,
  };
};

export default generateMetadata;
