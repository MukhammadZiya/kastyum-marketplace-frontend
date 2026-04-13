import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HomeShowcaseAdminConfig, HomeShowcaseUpdateBody } from "@repo/types";
import {
  getAdminHomeShowcase,
  getAuthToken,
  postAdminHomeShowcase,
  postAdminHomeShowcaseSlotImage,
  type HomeShowcaseSection,
} from "@repo/api";
import { adminHomeShowcaseKeys } from "./adminHomeShowcase.keys";

export function useAdminHomeShowcaseQuery() {
  const hasToken = !!getAuthToken();
  return useQuery({
    queryKey: adminHomeShowcaseKeys.config,
    queryFn: () => getAdminHomeShowcase(),
    enabled: hasToken,
  });
}

export function useAdminHomeShowcaseSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: HomeShowcaseUpdateBody) => postAdminHomeShowcase(body),
    onSuccess: (data) => {
      queryClient.setQueryData(adminHomeShowcaseKeys.config, data);
    },
  });
}

export function useAdminHomeShowcaseUploadImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      section: HomeShowcaseSection;
      index: number;
      file: File;
    }) =>
      postAdminHomeShowcaseSlotImage(args.section, args.index, args.file),
    onSuccess: (res, args) => {
      queryClient.setQueryData(
        adminHomeShowcaseKeys.config,
        (prev: HomeShowcaseAdminConfig | undefined) => {
          if (!prev) return prev;
          const key =
            args.section === "newArrivals" ? "newArrivals" : "mostPurchased";
          const slots = [...prev[key]];
          if (args.index < 0 || args.index >= slots.length) return prev;
          slots[args.index] = {
            ...slots[args.index],
            customImage: res.path,
          };
          return { ...prev, [key]: slots };
        },
      );
    },
  });
}
