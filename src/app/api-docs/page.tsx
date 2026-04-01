"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#014040] px-6 py-4 flex items-center gap-3">
        <div className="text-white">
          <h1 className="text-xl font-bold tracking-tight">Online Deutschkurs mit <span className="text-accent">Eliana</span> API</h1>
          <p className="text-sm text-[#D5F2EA]/80">Documentation des endpoints REST</p>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="swagger-wrapper">
        <SwaggerUI
          url="/api/docs"
          docExpansion="list"
          defaultModelsExpandDepth={1}
          tryItOutEnabled={true}
        />
      </div>

      <style jsx global>{`
        /* Personnalisation couleurs Nextkurs */
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info .title {
          color: #014040;
        }
        .swagger-ui .btn.authorize,
        .swagger-ui .btn.execute {
          background-color: #F25F29;
          border-color: #F25F29;
          color: #fff;
        }
        .swagger-ui .btn.authorize:hover,
        .swagger-ui .btn.execute:hover {
          background-color: #BF613F;
          border-color: #BF613F;
        }
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background-color: #014040;
        }
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background-color: #F25F29;
        }
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background-color: #BF613F;
        }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background-color: #c0392b;
        }
        .swagger-ui .opblock.opblock-patch .opblock-summary-method {
          background-color: #F2E9BD;
          color: #014040;
        }
        .swagger-ui .tab li.tabitem.active h4 span {
          color: #014040;
        }
        .swagger-ui section.models .model-container {
          background-color: #f8fffe;
          border-color: #D5F2EA;
        }
        .swagger-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
        }
      `}</style>
    </div>
  );
}

