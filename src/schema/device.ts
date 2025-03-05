import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const deviceTypeEnum = pgEnum("device_type", ["light", "ai", "lock"]);
export const deviceStatusEnum = pgEnum("device_status", ["on", "off", "open", "closed"]);

// 设备表
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  type: deviceTypeEnum("type").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  requestUrl: varchar("request_url", { length: 512 }).notNull(),
  status: deviceStatusEnum("status").notNull().default("off"),
  messages: varchar("messages", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 操作日志表
export const deviceLogs = pgTable("device_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  deviceId: integer("device_id")
    .references(() => devices.id)
    .notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
