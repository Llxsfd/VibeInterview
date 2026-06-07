export const metrics = [
  { label: "资料", value: "8", trend: "+2" },
  { label: "Chunk", value: "326", trend: "92%" },
  { label: "问答", value: "41", trend: "+12" },
  { label: "面试分", value: "78", trend: "+8" },
];

export const documents = [
  { id: "os", name: "操作系统面试资料.pdf", subject: "操作系统", status: "indexed", chunks: 126, pages: 82, updated: "今日" },
  { id: "network", name: "计算机网络核心考点.pdf", subject: "计算机网络", status: "indexed", chunks: 98, pages: 64, updated: "昨日" },
  { id: "db", name: "数据库事务与索引.pdf", subject: "数据库", status: "parsing", chunks: 102, pages: 58, updated: "刚刚" },
];

export const chunks = [
  { chapter: "第3章 操作系统", section: "3.1 进程与线程", page: "23-24", score: "0.91", content: "进程是资源分配的基本单位，线程是 CPU 调度的基本单位。线程共享进程资源，切换开销更小。" },
  { chapter: "第4章 内存管理", section: "4.2 虚拟内存", page: "37", score: "0.84", content: "虚拟内存通过页表建立虚拟地址到物理地址的映射，并结合缺页中断完成按需调页。" },
  { chapter: "第5章 同步", section: "5.1 死锁", page: "51", score: "0.79", content: "死锁产生需要互斥、请求保持、不可剥夺和循环等待四个必要条件同时成立。" },
];

export const knowledgePoints = [
  { name: "进程与线程", subject: "操作系统", mastery: 76, difficulty: "中等", keywords: ["进程", "线程", "调度"] },
  { name: "TCP 三次握手", subject: "计算机网络", mastery: 68, difficulty: "中等", keywords: ["TCP", "SYN", "ACK"] },
  { name: "B+ 树索引", subject: "数据库", mastery: 58, difficulty: "高级", keywords: ["索引", "范围查询", "叶子节点"] },
];

export const questions = [
  { stem: "线程和进程的核心区别是什么？", type: "面试题", subject: "操作系统", score: 0.82 },
  { stem: "为什么 TCP 连接建立通常需要三次握手？", type: "简答题", subject: "计算机网络", score: 0.74 },
  { stem: "B+ 树为什么适合数据库范围查询？", type: "单选题", subject: "数据库", score: 0.63 },
];

export const interviews = [
  { id: "int-1", mode: "专项", subject: "操作系统", status: "active", score: 78, turns: 5 },
  { id: "int-2", mode: "岗位", subject: "Java 后端", status: "finished", score: 84, turns: 6 },
];

export const mistakes = [
  { id: "m1", title: "B+ 树叶子节点链表作用", subject: "数据库", reason: "漏掉范围查询场景", reviews: 1 },
  { id: "m2", title: "死锁四个必要条件", subject: "操作系统", reason: "条件表述不完整", reviews: 2 },
];

export const studyDays = [
  { day: 1, title: "操作系统核心概念", done: 2, total: 3 },
  { day: 2, title: "网络协议与连接管理", done: 1, total: 3 },
  { day: 3, title: "数据库事务与索引", done: 0, total: 3 },
];
