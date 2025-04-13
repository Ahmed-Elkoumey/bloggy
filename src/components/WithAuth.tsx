  // src/components/withAuth.tsx
  "use client";

  import React, { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { decryptData } from "@/utils/crypto";


  function withAuth(
    WrappedComponent:any
  ) {
    const WithAuth = (props:any) => {
      const router = useRouter();
      const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

      useEffect(() => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");

          if (!token) {
            router.push("/login");
            return;
          }

          try {
            // Verify token is valid
            decryptData(token);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("accessToken");
            router.push("/login");
          }
        }
      }, [router]);

      if (!isAuthenticated) {
        return null;
      }

      return <WrappedComponent {...props} />;
    };

    // Set display name for easier debugging
    WithAuth.displayName = `WithAuth(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return WithAuth;
  }

  export default withAuth;

