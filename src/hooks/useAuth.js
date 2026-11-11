import { useMemo } from "react";

export function useAuth() {
  return useMemo(() => ({
    token: localStorage.getItem("gg_token"),
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem("gg_user") || "null");
      } catch {
        return null;
      }
    })(),
  }), []);
}
