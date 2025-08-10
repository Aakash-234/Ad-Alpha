import { useQuery } from '@tanstack/react-query';
import { getCreatives, InputType, OutputType } from '../endpoints/creatives_GET.schema';

export const useCreatives = (params: InputType) => {
  return useQuery<OutputType, Error>({
    queryKey: ['creatives', params],
    queryFn: () => getCreatives(params),
  });
};