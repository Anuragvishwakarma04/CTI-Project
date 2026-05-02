import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export const handleSmartBack = (
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams
) => {
  const from = searchParams.get("from");

  if (from) {
    router.push(`/${from}`);
  } else {
    router.back();
  }
};