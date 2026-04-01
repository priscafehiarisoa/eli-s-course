import { NextResponse } from "next/server";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Online Deutschkurs mit Eliana API",
    version: "1.0.0",
    description: "Documentation des APIs de la plateforme Online Deutschkurs mit Eliana – gestion des cours, inscriptions et messages de contact.",
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      description: "Serveur local",
    },
  ],
  tags: [
    { name: "Courses", description: "Gestion des cours" },
    { name: "Enrollments", description: "Gestion des inscriptions" },
    { name: "Contact", description: "Messages de contact" },
  ],
  components: {
    schemas: {
      Translation: {
        type: "object",
        properties: {
          locale: { type: "string", example: "fr" },
          title: { type: "string", example: "Allemand A1 – Débutants" },
          description: { type: "string", example: "Cours pour débutants complets." },
        },
        required: ["locale", "title", "description"],
      },
      Module: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string", example: "Leçon 1 – Les salutations" },
          order: { type: "integer", example: 1 },
        },
      },
      Course: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          slug: { type: "string", example: "allemand-a1" },
          level: { type: "string", example: "A1" },
          image: { type: "string", nullable: true, example: "/images/a1.jpg" },
          price: { type: "number", example: 299.0 },
          maxCapacity: { type: "integer", example: 15 },
          startDate: { type: "string", format: "date-time", example: "2026-04-01T00:00:00.000Z" },
          scheduleDays: { type: "string", example: "Lundi / Mercredi" },
          scheduleTime: { type: "string", example: "18h00 – 19h30" },
          translations: { type: "array", items: { $ref: "#/components/schemas/Translation" } },
          modules: { type: "array", items: { $ref: "#/components/schemas/Module" } },
        },
      },
      CourseInput: {
        type: "object",
        required: ["slug", "level", "price", "maxCapacity", "startDate"],
        properties: {
          slug: { type: "string", example: "allemand-a1" },
          level: { type: "string", example: "A1" },
          image: { type: "string", nullable: true },
          price: { type: "number", example: 299.0 },
          maxCapacity: { type: "integer", example: 15 },
          startDate: { type: "string", format: "date", example: "2026-04-01" },
          scheduleDays: { type: "string", example: "Lundi / Mercredi" },
          scheduleTime: { type: "string", example: "18h00 – 19h30" },
          translations: {
            type: "array",
            items: { $ref: "#/components/schemas/Translation" },
          },
          modules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                order: { type: "integer" },
              },
            },
          },
        },
      },
      Enrollment: {
        type: "object",
        properties: {
          id: { type: "string" },
          firstName: { type: "string", example: "Marie" },
          lastName: { type: "string", example: "Dupont" },
          email: { type: "string", example: "marie@exemple.com" },
          street: { type: "string", example: "12 rue des Lilas" },
          postalCode: { type: "string", example: "75001" },
          city: { type: "string", example: "Paris" },
          courseId: { type: "string" },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "CANCELLED"],
            example: "PENDING",
          },
          startDate: { type: "string", format: "date-time" },
          paymentDate: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          course: { $ref: "#/components/schemas/Course" },
        },
      },
      EnrollmentInput: {
        type: "object",
        required: ["firstName", "lastName", "email", "courseId"],
        properties: {
          firstName: { type: "string", example: "Marie" },
          lastName: { type: "string", example: "Dupont" },
          email: { type: "string", example: "marie@exemple.com" },
          street: { type: "string", example: "12 rue des Lilas" },
          postalCode: { type: "string", example: "75001" },
          city: { type: "string", example: "Paris" },
          courseId: { type: "string", example: "clxyz123" },
        },
      },
      ContactInput: {
        type: "object",
        required: ["name", "email", "subject", "message"],
        properties: {
          name: { type: "string", example: "Jean Martin" },
          email: { type: "string", example: "jean@exemple.com" },
          subject: { type: "string", example: "Renseignements cours A2" },
          message: { type: "string", example: "Bonjour, je voudrais savoir..." },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Missing required fields" },
        },
      },
    },
  },
  paths: {
    "/api/courses": {
      get: {
        tags: ["Courses"],
        summary: "Récupérer tous les cours",
        description: "Retourne la liste complète des cours avec leurs traductions, modules et nombre d'inscrits.",
        responses: {
          200: {
            description: "Liste des cours",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Course" } },
              },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      post: {
        tags: ["Courses"],
        summary: "Créer un nouveau cours",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CourseInput" } },
          },
        },
        responses: {
          201: {
            description: "Cours créé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Course" } },
            },
          },
          400: {
            description: "Champs manquants",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          409: {
            description: "Slug déjà existant",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/courses/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Récupérer un cours par son slug",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Slug du cours",
            schema: { type: "string", example: "allemand-a1" },
          },
        ],
        responses: {
          200: {
            description: "Cours trouvé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Course" } },
            },
          },
          404: {
            description: "Cours non trouvé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      put: {
        tags: ["Courses"],
        summary: "Mettre à jour un cours",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Slug du cours",
            schema: { type: "string", example: "allemand-a1" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CourseInput" } },
          },
        },
        responses: {
          200: {
            description: "Cours mis à jour",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Course" } },
            },
          },
          404: {
            description: "Cours non trouvé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      delete: {
        tags: ["Courses"],
        summary: "Supprimer un cours",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Slug du cours",
            schema: { type: "string", example: "allemand-a1" },
          },
        ],
        responses: {
          200: {
            description: "Cours supprimé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", example: true } },
                },
              },
            },
          },
          404: {
            description: "Cours non trouvé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/enrollments": {
      get: {
        tags: ["Enrollments"],
        summary: "Récupérer les inscriptions",
        description: "Retourne les inscriptions, avec filtres optionnels par courseId, status ou recherche de nom/email.",
        parameters: [
          {
            name: "courseId",
            in: "query",
            required: false,
            description: "Filtrer par ID du cours",
            schema: { type: "string" },
          },
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filtrer par statut",
            schema: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] },
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "Recherche par prénom, nom ou email",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Liste des inscriptions",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Enrollment" } },
              },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      post: {
        tags: ["Enrollments"],
        summary: "Créer une inscription",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/EnrollmentInput" } },
          },
        },
        responses: {
          201: {
            description: "Inscription créée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    enrollment: { $ref: "#/components/schemas/Enrollment" },
                  },
                },
              },
            },
          },
          400: {
            description: "Champs manquants",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          404: {
            description: "Cours non trouvé",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          409: {
            description: "Cours complet ou déjà inscrit",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/enrollments/{id}": {
      patch: {
        tags: ["Enrollments"],
        summary: "Mettre à jour le statut ou la date de paiement d'une inscription",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID de l'inscription",
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
                    example: "CONFIRMED",
                  },
                  paymentDate: {
                    type: "string",
                    format: "date",
                    example: "2026-03-15",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Inscription mise à jour",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Enrollment" } },
            },
          },
          404: {
            description: "Inscription non trouvée",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      delete: {
        tags: ["Enrollments"],
        summary: "Supprimer une inscription",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID de l'inscription",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Inscription supprimée",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", example: true } },
                },
              },
            },
          },
          404: {
            description: "Inscription non trouvée",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Contact"],
        summary: "Envoyer un message de contact",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } },
          },
        },
        responses: {
          201: {
            description: "Message envoyé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    contact: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        subject: { type: "string" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Champs manquants",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          500: {
            description: "Erreur serveur",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(swaggerSpec);
}

