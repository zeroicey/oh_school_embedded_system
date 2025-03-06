import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/postgres";
import { devices } from "../schema/device";
import validater from "../middlewares/validate";
import Responder from "../middlewares/response";

const device = new Hono();

// 验证schema
const idSchema = z.object({
  id: z.string().min(1, "设备ID不能为空"),
});

// 获取所有设备信息
device.get("/devices", async (c) => {
  try {
    const allDevices = await db.select().from(devices);
    return Responder.success("获取设备列表成功").setData(allDevices).build(c);
  } catch (error) {
    return Responder.fail("获取设备信息失败").setStatusCode(500).build(c);
  }
});

// 获取指定设备详细信息
device.get("/devices/:id", validater("param", idSchema), async (c) => {
  const { id } = c.req.valid("param");
  try {
    const device = await db.select().from(devices).where(eq(devices.id, id));
    if (!device.length) {
      return Responder.fail("设备不存在").setStatusCode(404).build(c);
    }
    return Responder.success("获取设备信息成功").setData(device[0]).build(c);
  } catch (error) {
    return Responder.fail("获取设备信息失败").setStatusCode(500).build(c);
  }
});

// 打开指定可控灯
device.get(
  "/devices/light/open/:id",
  validater("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      // 当ID为1时，发送特殊请求
      if (id === "1") {
        const response = await fetch(
          "http://ohschool.free.idcfengye.com/update?relay=5&state=1"
        );
        if (!response.ok) {
          throw new Error("控制灯失败");
        }
        return Responder.success("灯已打开")
          .setData({ id, status: "on" })
          .build(c);
      }

      // 其他ID走正常数据库流程
      const device = await db.select().from(devices).where(eq(devices.id, id));
      if (!device.length) {
        return Responder.fail("设备不存在").setStatusCode(404).build(c);
      }
      if (device[0].type !== "light") {
        return Responder.fail("该设备不是灯").setStatusCode(400).build(c);
      }
      await db.update(devices).set({ status: "on" }).where(eq(devices.id, id));
      return Responder.success("灯已打开")
        .setData({ id, status: "on" })
        .build(c);
    } catch (error) {
      return Responder.fail("操作失败").setStatusCode(500).build(c);
    }
  }
);

// 关闭指定可控灯
device.get(
  "/devices/light/close/:id",
  validater("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      // 当ID为1时，发送特殊请求
      if (id === "1") {
        const response = await fetch(
          "http://ohschool.free.idcfengye.com/update?relay=5&state=0"
        );
        if (!response.ok) {
          throw new Error("控制灯失败");
        }
        return Responder.success("灯已关闭")
          .setData({ id, status: "off" })
          .build(c);
      }

      // 其他ID走正常数据库流程
      const device = await db.select().from(devices).where(eq(devices.id, id));
      if (!device.length) {
        return Responder.fail("设备不存在").setStatusCode(404).build(c);
      }
      if (device[0].type !== "light") {
        return Responder.fail("该设备不是灯").setStatusCode(400).build(c);
      }
      await db.update(devices).set({ status: "off" }).where(eq(devices.id, id));
      return Responder.success("灯已关闭")
        .setData({ id, status: "off" })
        .build(c);
    } catch (error) {
      return Responder.fail("操作失败").setStatusCode(500).build(c);
    }
  }
);

// 打开指定可控门
device.get(
  "/devices/lock/open/:id",
  validater("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      const device = await db.select().from(devices).where(eq(devices.id, id));
      if (!device.length) {
        return Responder.fail("设备不存在").setStatusCode(404).build(c);
      }
      if (device[0].type !== "lock") {
        return Responder.fail("该设备不是门锁").setStatusCode(400).build(c);
      }
      await db
        .update(devices)
        .set({ status: "open" })
        .where(eq(devices.id, id));
      return Responder.success("门已打开")
        .setData({ id, status: "open" })
        .build(c);
    } catch (error) {
      return Responder.fail("操作失败").setStatusCode(500).build(c);
    }
  }
);

// 关闭指定可控门
device.get(
  "/devices/lock/close/:id",
  validater("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      const device = await db.select().from(devices).where(eq(devices.id, id));
      if (!device.length) {
        return Responder.fail("设备不存在").setStatusCode(404).build(c);
      }
      if (device[0].type !== "lock") {
        return Responder.fail("该设备不是门锁").setStatusCode(400).build(c);
      }
      await db
        .update(devices)
        .set({ status: "closed" })
        .where(eq(devices.id, id));
      return Responder.success("门已关闭")
        .setData({ id, status: "closed" })
        .build(c);
    } catch (error) {
      return Responder.fail("操作失败").setStatusCode(500).build(c);
    }
  }
);

// 获取指定AI助手聊天信息
device.get(
  "/devices/ai/message/:id",
  validater("param", idSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      const device = await db.select().from(devices).where(eq(devices.id, id));
      if (!device.length) {
        return Responder.fail("设备不存在").setStatusCode(404).build(c);
      }
      if (device[0].type !== "ai") {
        return Responder.fail("该设备不是AI助手").setStatusCode(400).build(c);
      }
      return Responder.success("获取聊天信息成功")
        .setData({ messages: device[0].messages || [] })
        .build(c);
    } catch (error) {
      return Responder.fail("获取聊天信息失败").setStatusCode(500).build(c);
    }
  }
);

export default device;
