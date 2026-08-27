#!/usr/bin/env node
// 纯哪吒 v0 agent 启动脚本（无 WebSocket，避免平台限制）
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec, execSync } = require('child_process');

// ===== 哪吒 v0 配置（写死，避免平台弹环境变量）=====
const NEZHA_SERVER = 'nezhak2.btpp.ggff.net';  // v0 面板服务器
const NEZHA_PORT = '443';                      // v0 agent 端口（443/8443/2096/2087/2083/2053 开 TLS）
const NEZHA_KEY = '11zampto';                  // v0 agent 密钥
const UUID = '8d6b237f-366f-439a-bbf2-a1fa1c0a6c11';

const AGENT_URL = 'https://amd64.ssss.nyc.mn/agent';
const AGENT_FILE = path.join(__dirname, 'npm');

// TLS 端口列表（v0 规则）
const TLS_PORTS = ['443', '8443', '2096', '2087', '2083', '2053'];

async function downloadAgent() {
  console.log('[Nezha] 下载 agent 二进制...');
  const res = await axios({
    method: 'get',
    url: AGENT_URL,
    responseType: 'stream',
    timeout: 120000
  });
  const writer = fs.createWriteStream(AGENT_FILE);
  res.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  console.log('[Nezha] 下载完成，设置执行权限');
  execSync('chmod +x ' + AGENT_FILE);
}

function runAgent() {
  const tls = TLS_PORTS.includes(NEZHA_PORT) ? '--tls' : '';
  const cmd = `${AGENT_FILE} -s ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY} ${tls} --disable-auto-update --report-delay 4 --skip-conn --skip-procs`;
  console.log('[Nezha] 启动命令:', cmd);
  const child = exec(cmd, { shell: '/bin/bash' }, (err, stdout, stderr) => {
    if (err) console.error('[Nezha] agent 运行错误:', err.message);
  });
  child.stdout.on('data', d => process.stdout.write('[agent] ' + d));
  child.stderr.on('data', d => process.stderr.write('[agent] ' + d));
}

async function main() {
  try {
    if (!fs.existsSync(AGENT_FILE)) {
      await downloadAgent();
    }
    runAgent();
  } catch (e) {
    console.error('[Nezha] 启动失败:', e.message);
    process.exit(1);
  }
}

// 保持进程存活
main();
setInterval(() => {}, 1000);
