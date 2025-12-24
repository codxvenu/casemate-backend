import { z } from "zod";

export const uploadSchema = z.object({
  body: z.object({
    fileData: z.object({
      originalName: z.coerce.string().min(1),
      type: z.coerce.string().min(1),
      size: z.coerce.number(),
      created_at: z.coerce.date(),
      folderId: z.coerce.number().nullable(),
    }),
  }),
  userId: z.coerce.number(),
});
export const deleteSchema = z.object({
  query: z.object({
    fileId: z.coerce.number().nullable(),
  }),
  userId: z.number(),
});
export const CreateFolderSchema = z.object({
  query: z.object({
    name: z.string(),
    folderId: z.coerce.number().nullable(),
  }),
  userId: z.number(),
});
export const RenameSchema = z.object({
  query: z.object({
    name: z.string(),
    fileId: z.coerce.number().nullable(),
  }),
  userId: z.number(),
});
export const PreviewSchema = z.object({
  query: z.object({
    name: z.string(),
  }),
});
export const AddShareSchema = z.object({
  body: z.object({
      filename: z.coerce.string().min(1),
      sharetype: z.coerce.string().min(1),
      fileId: z.coerce.number(),
      allowedUser: z.array(z.number()),
  }),
  userId: z.coerce.number(),
});
export const getFileAccessSchema = z.object({
  query: z.object({
    token: z.string(),
  }),
  userId: z.coerce.number().optional(),
});
