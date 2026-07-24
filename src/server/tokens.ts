import { requireUser } from "@/server/require-user";
import { projects } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";



export const createToken = createServerFn({