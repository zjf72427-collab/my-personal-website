<template>
  <section id="lab" class="w">
    <div class="sh rv"><span class="snum">06</span><h2 class="stit">HARD LAB</h2><div class="sl2"></div></div>
    <div class="terminal rv">
      <div class="term-bar">
        <div class="term-dots">
          <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
        </div>
        <span class="term-title">root@muz-lab — bash — 80x24</span>
        <span class="term-ssh">ssh muz@192.168.1.1</span>
      </div>
      <div class="term-body">
        <div v-for="(line, i) in bootLines" :key="i" class="boot-line"
          :style="{ animationDelay: i * 0.07 + 's' }">
          <span class="boot-ok"   v-if="line.type === 'ok'"  >[ OK ]</span>
          <span class="boot-info" v-else-if="line.type === 'info'">[ ** ]</span>
          <span class="boot-warn" v-else-if="line.type === 'warn'">[ !! ]</span>
          <span class="boot-text">{{ line.text }}</span>
        </div>
        <div class="term-divider"></div>
        <div class="term-line">
          <span class="prompt">root@muz-lab</span><span class="ps">:</span>
          <span class="ppath">~/notes</span><span class="pdollar">$</span>
          <span class="cmd"> ls -la</span>
        </div>
        <div class="ls-output">
          <div class="ls-head">total {{ labs.length }}</div>
          <div v-for="lab in labs" :key="lab.id" class="ls-row">
            <span class="ls-perm">drwxr-xr-x</span>
            <span class="ls-sz">{{ lab.notes.length }}</span>
            <span class="ls-date">2026-03-20</span>
            <span class="ls-name" :style="{ color: lab.color }">{{ lab.dir }}/</span>
          </div>
        </div>
        <div v-for="lab in labs" :key="lab.id" class="note-block">
          <div class="term-line" style="margin-top:22px">
            <span class="prompt">root@muz-lab</span><span class="ps">:</span>
            <span class="ppath">~/notes/{{ lab.dir }}</span><span class="pdollar">$</span>
            <span class="cmd"> cat README.md</span>
          </div>
          <div class="file-header" :style="{ borderLeftColor: lab.color }">
            <span class="fh-hash" :style="{ color: lab.color }">#</span>
            <span class="fh-title">{{ lab.title }}</span>
            <span class="fh-meta">// {{ lab.meta }}</span>
          </div>
          <div class="entry-list">
            <div v-for="note in lab.notes" :key="note.heading"
              class="entry-item" :class="{ expanded: note.open }"
              @click="note.open = !note.open">
              <div class="entry-header">
                <span class="etoggle" :style="{ color: lab.color }">{{ note.open ? '▼' : '►' }}</span>
                <span class="eheading">{{ note.heading }}</span>
                <span class="etag" :style="{ color: lab.color, borderColor: lab.color }">{{ note.tag }}</span>
              </div>
              <transition name="eslide">
                <div v-if="note.open" class="entry-body">
                  <div v-for="ln in note.lines" :key="ln" class="eline">
                    <span class="ebullet" :style="{ color: lab.color }">▸</span><span>{{ ln }}</span>
                  </div>
                  <div v-if="note.md" class="entry-md">{{ note.md }}</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="term-divider" style="margin-top:24px"></div>
        <div class="iterm" ref="itermEl">
          <div v-for="(entry, i) in history" :key="i" class="iterm-entry">
            <div class="iterm-cmd-line">
              <span class="prompt">root@muz-lab</span><span class="ps">:</span><span class="ppath">~</span><span class="pdollar">$</span>
              <span class="iterm-input-echo"> {{ entry.cmd }}</span>
            </div>
            <div v-if="entry.output" class="iterm-output" v-html="entry.output"></div>
          </div>
          <div class="iterm-cmd-line">
            <span class="prompt">root@muz-lab</span><span class="ps">:</span><span class="ppath">~</span><span class="pdollar">$</span>
            <input
              ref="inputEl"
              v-model="currentCmd"
              class="iterm-real-input"
              spellcheck="false"
              autocomplete="off"
              @keydown.enter="submitCmd"
              @keydown.up.prevent="historyUp"
              @keydown.down.prevent="historyDown"
              @keydown.tab.prevent="tabComplete"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface LabNote { heading: string; tag: string; open: boolean; lines: string[]; md?: string }
interface Lab { id: string; dir: string; title: string; meta: string; color: string; notes: LabNote[] }

const bootLines = [
  { type: 'ok',   text: 'Loaded kernel modules: vmmon, vmnet, vboxdrv' },
  { type: 'ok',   text: 'Started NetworkManager - network connectivity' },
  { type: 'ok',   text: 'Started OpenSSH server daemon (sshd)' },
  { type: 'info', text: 'Initializing GNS3 topology engine...' },
  { type: 'ok',   text: 'Mounted /dev/sda1 on / (ext4, rw)' },
  { type: 'warn', text: 'Broadcom tg3 driver: firmware mismatch detected' },
  { type: 'ok',   text: 'System ready - muz-lab login:' },
]

const labs = reactive<Lab[]>([
  {
    id: 'vmware', dir: 'vmware', title: 'VMware 排坑实录',
    meta: '虚拟化 / 网络 / 快照 / 迁移', color: '#00f5ff',
    notes: [
      { heading: 'Workstation 17 安装与激活踩坑', tag: 'INSTALL', open: false, lines: [
        '安装前：关闭 Hyper-V (bcdedit /set hypervisorlaunchtype off) 并重启',
        'Windows 11 需关闭内核隔离：设备安全 → 内核隔离 → 关闭',
        '激活失败提示 License not valid：检查系统时间是否准确',
        '安装完成后建议立即创建初始快照作为干净基线',
      ], md: '' },
      { heading: 'NAT 模式 Guest OS 无法联网', tag: 'NETWORK', open: false, lines: [
        '现象：Host 可联网，Guest ping 网关失败',
        '排查 1：检查 VMware DHCP 服务是否运行 (services.msc → VMware DHCP Service)',
        '排查 2：还原 VMnet8 到默认配置：Edit → Virtual Network Editor → Restore Defaults',
        '排查 3：Guest 内 nmcli device status，确认网卡为 connected',
        '终极方案：卸载所有虚拟网卡 → 重装 VMware Tools',
      ], md: '' },
      { heading: 'Shared Folders 挂载失败 / VMware Tools', tag: 'TOOLS', open: false, lines: [
        '症状：/mnt/hgfs 为空，mount | grep vmhgfs 无输出',
        '方案：vmware-config-tools.pl 重新编译 vmhgfs 模块',
        '或使用 open-vm-tools：apt install open-vm-tools open-vm-tools-desktop',
        '挂载命令：vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other',
        '开机自动挂载：写入 /etc/fstab',
      ], md: '' },
      { heading: '快照管理与磁盘爆满预防', tag: 'SNAPSHOT', open: false, lines: [
        '快照链过长导致 I/O 性能劣化 → 保持快照不超过 3 层',
        '合并快照：VM → Snapshot → Snapshot Manager → Delete All',
        '压缩虚拟磁盘：VMware Tools → Shrink Disk (先在 Guest 清理临时文件)',
        '监控宿主机磁盘：快照增量文件 -delta.vmdk 可能无声暴涨',
      ], md: '' },
    ],
  },
  {
    id: 'linux', dir: 'linux', title: 'CentOS 服务器部署',
    meta: 'yum / firewall / Nginx / systemd', color: '#00ff88',
    notes: [
      { heading: 'CentOS 7 最小化安装后必做 10 件事', tag: 'INIT', open: false, lines: [
        '1. 更新系统：yum update -y',
        '2. 换源 (阿里云)：curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo',
        '3. 安装常用工具：yum install -y vim wget curl net-tools git htop',
        '4. 设置时区：timedatectl set-timezone Asia/Shanghai',
        '5. 关闭 SELinux (临时)：setenforce 0；永久：/etc/selinux/config → SELINUX=disabled',
        '6. 配置 hostname：hostnamectl set-hostname muz-server',
        '7. 创建普通用户并加入 wheel 组：useradd muz && usermod -aG wheel muz',
        '8. 配置 SSH 免密登录 (见下条目)',
        '9. 开放必要端口并保存 firewalld 规则',
        '10. 开启 chrony 时间同步：systemctl enable --now chronyd',
      ], md: '' },
      { heading: 'firewalld 端口开放实战', tag: 'FIREWALL', open: false, lines: [
        '查看状态：firewall-cmd --state',
        '开放端口 (永久)：firewall-cmd --permanent --add-port=80/tcp',
        '重载规则：firewall-cmd --reload',
        '查看已开放端口：firewall-cmd --list-all',
        '允许服务：firewall-cmd --permanent --add-service=https',
        '删除规则：firewall-cmd --permanent --remove-port=8080/tcp',
      ], md: '' },
      { heading: 'Nginx 反代 + SSL 证书 (Let s Encrypt)', tag: 'NGINX', open: false, lines: [
        '安装：yum install -y nginx && systemctl enable --now nginx',
        '申请证书：certbot --nginx -d example.com',
        '反向代理：proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host;',
        '强制 HTTPS：return 301 https://$host$request_uri;',
        '自动续签：echo "0 0 * * * certbot renew --quiet" >> /etc/crontab',
      ], md: '' },
      { heading: 'SSH 免密登录 + 安全加固', tag: 'SSH', open: false, lines: [
        '生成密钥对：ssh-keygen -t ed25519 -C "muz@server"',
        '上传公钥：ssh-copy-id -i ~/.ssh/id_ed25519.pub muz@server',
        '禁用密码登录：PasswordAuthentication no',
        '禁用 root 远程登录：PermitRootLogin no',
        '修改默认端口：Port 2222 (记得同步更新 firewalld)',
        '限制登录用户：AllowUsers muz',
      ], md: '' },
    ],
  },
  {
    id: 'gns3', dir: 'gns3', title: 'GNS3 与 Broadcom 实战',
    meta: 'OSPF / VLAN / Wireshark / tg3 驱动', color: '#ff006e',
    notes: [
      { heading: 'GNS3 2.x 安装配置', tag: 'SETUP', open: false, lines: [
        '推荐方案：GNS3 VM + VMware Workstation (性能优于本地模式)',
        '下载 GNS3 VM.ova → VMware 导入 → 分配 4 核 / 8GB RAM',
        'GNS3 GUI → Edit → Preferences → GNS3 VM → 选择已导入的 VM',
        'Cisco IOS 镜像：上传至 GNS3 VM 后在 GUI 添加路由器模板',
        '测试连通性：拖入两台路由器 → 连线 → 开启 → Console 进入配置',
      ], md: '' },
      { heading: 'Broadcom tg3 网卡驱动排障', tag: 'DRIVER', open: false, lines: [
        '症状：dmesg | grep tg3 出现 firmware mismatch 或 no suitable firmware',
        '安装固件包：apt install firmware-linux-nonfree 或 yum install linux-firmware',
        '手动加载：modprobe -r tg3 && modprobe tg3',
        '查看驱动版本：ethtool -i eth0 | grep driver',
        '若内核版本过旧：考虑升级内核或编译最新 tg3 源码',
        '持久化：将固件加入 initramfs → update-initramfs -u',
      ], md: '' },
      { heading: 'OSPF 多区域配置实战', tag: 'OSPF', open: false, lines: [
        'Area 0 (骨干区域) 与 Area 1 互联，ABR 路由汇总',
        'R1 配置：router ospf 1 → network 10.0.0.0 0.0.0.255 area 0',
        'ABR 汇总：area 1 range 192.168.0.0 255.255.0.0',
        '验证：show ip ospf neighbor / show ip route ospf',
        'Wireshark 抓 Hello 包：观察 Hello Interval=10s / Dead Interval=40s',
      ], md: '' },
      { heading: 'VLAN Trunk 配置 + GNS3 抓包', tag: 'VLAN', open: false, lines: [
        'SW1 创建 VLAN：vlan database → vlan 10 name MGMT → vlan 20 name DATA',
        '配置 Trunk：int fa0/1 → switchport mode trunk → switchport trunk allowed vlan 10,20',
        'Access 口：switchport mode access → switchport access vlan 10',
        'GNS3 抓包：右键链路 → Start Capture → 自动打开 Wireshark',
        '过滤 802.1Q：Wireshark 过滤器输入 vlan.id == 10',
      ], md: '' },
    ],
  },
])

// ── Interactive Terminal ──────────────────────────────────────
const inputEl = ref<HTMLInputElement | null>(null)
const itermEl = ref<HTMLElement | null>(null)
const currentCmd = ref('')
const history = ref<{ cmd: string; output: string }[]>([])
const cmdHistory: string[] = []
let histIdx = -1

const vfs: Record<string, string[]> = {
  '~': ['vmware/', 'linux/', 'gns3/', 'README.md'],
  '~/vmware': labs[0]?.notes.map(n => n.heading + '.md') ?? [],
  '~/linux':  labs[1]?.notes.map(n => n.heading + '.md') ?? [],
  '~/gns3':   labs[2]?.notes.map(n => n.heading + '.md') ?? [],
}
const cwd = ref('~')

const commands: Record<string, (args: string[]) => string> = {
  help: () => [
    '<span style="color:#00f5ff">Available commands:</span>',
    '  <b>ls</b>          — list directory contents',
    '  <b>cd</b> [dir]    — change directory',
    '  <b>cat</b> [file]  — display file content',
    '  <b>pwd</b>         — print working directory',
    '  <b>clear</b>       — clear terminal',
    '  <b>neofetch</b>    — system info',
    '  <b>echo</b> [text] — print text',
    '  <b>history</b>     — command history',
    '  <b>help</b>        — show this help',
  ].join('<br>'),

  ls: (args) => {
    const dir = args[0] ? `~/${args[0]}` : cwd.value
    const entries = vfs[dir] ?? vfs[cwd.value] ?? []
    if (!entries.length) return '<span style="color:#ff006e">ls: no such directory</span>'
    return entries.map(e =>
      e.endsWith('/') ? `<span style="color:#00f5ff">${e}</span>` : `<span style="color:#eaf4ff">${e}</span>`
    ).join('  ')
  },

  pwd: () => `<span style="color:#00f5ff">${cwd.value.replace('~', '/root')}</span>`,

  cd: (args) => {
    if (!args[0] || args[0] === '~') { cwd.value = '~'; return '' }
    const target = args[0].startsWith('~') ? args[0] : `${cwd.value}/${args[0]}`.replace('//', '/')
    const key = target.startsWith('~/') || target === '~' ? target : `~/${args[0]}`
    if (vfs[key] !== undefined) { cwd.value = key; return '' }
    return `<span style="color:#ff006e">cd: ${args[0]}: No such file or directory</span>`
  },

  cat: (args) => {
    if (!args[0]) return '<span style="color:#ff006e">cat: missing operand</span>'
    const labMap: Record<string, Lab> = { vmware: labs[0], linux: labs[1], gns3: labs[2] }
    const dirKey = cwd.value.replace('~/', '')
    const lab = labMap[dirKey]
    if (lab) {
      const note = lab.notes.find(n => args[0].startsWith(n.heading.slice(0, 8)))
      if (note) {
        return [
          `<span style="color:#00f5ff"># ${note.heading}</span>`,
          ...note.lines.map(l => `<span style="color:#8aaac8">  ${l}</span>`),
        ].join('<br>')
      }
    }
    if (args[0] === 'README.md') return '<span style="color:#8aaac8">// muz-lab 笔记库 — 用 ls 查看目录，cd 进入，cat 读取笔记</span>'
    return `<span style="color:#ff006e">cat: ${args[0]}: No such file or directory</span>`
  },

  echo: (args) => `<span style="color:#eaf4ff">${args.join(' ')}</span>`,

  clear: () => { history.value = []; return '__CLEAR__' },

  history: () => cmdHistory.map((c, i) => `<span style="color:rgba(0,245,255,.4)">${String(i+1).padStart(3)}  </span><span style="color:#eaf4ff">${c}</span>`).join('<br>') || '<span style="color:#8aaac8">// no history</span>',

  neofetch: () => [
    '<span style="color:#00f5ff">       ___  ___  </span>  <b style="color:#eaf4ff">root@muz-lab</b>',
    '<span style="color:#00f5ff">      /   \/   \ </span>  <span style="color:#8aaac8">─────────────</span>',
    '<span style="color:#00f5ff">     | 木  | Z  |</span>  OS: CentOS 7 x86_64',
    '<span style="color:#00f5ff">      \___/\___/ </span>  Shell: bash 5.1.8',
    '                   Terminal: muz-lab v2.0',
    '                   CPU: Intel Core i7-12700H',
    '                   Memory: 16GB DDR5',
    `                   Uptime: ${Math.floor(Math.random()*24)}h ${Math.floor(Math.random()*60)}m`,
    '                   <span style="color:#00f5ff">██</span><span style="color:#ff006e">██</span><span style="color:#7b2fff">██</span><span style="color:#00ff88">██</span>',
  ].join('<br>'),
}

function submitCmd() {
  const raw = currentCmd.value.trim()
  currentCmd.value = ''
  histIdx = -1
  if (!raw) return
  cmdHistory.unshift(raw)
  const [cmd, ...args] = raw.split(/\s+/)
  const fn = commands[cmd]
  let output = fn ? fn(args) : `<span style="color:#ff006e">command not found: ${cmd}. Type <b>help</b> for available commands.</span>`
  if (output === '__CLEAR__') return
  history.value.push({ cmd: raw, output })
  nextTick(() => {
    itermEl.value?.scrollTo({ top: itermEl.value.scrollHeight, behavior: 'smooth' })
    inputEl.value?.focus()
  })
}

function historyUp() {
  if (histIdx < cmdHistory.length - 1) {
    histIdx++
    currentCmd.value = cmdHistory[histIdx]
  }
}
function historyDown() {
  if (histIdx > 0) { histIdx--; currentCmd.value = cmdHistory[histIdx] }
  else { histIdx = -1; currentCmd.value = '' }
}
function tabComplete() {
  const entries = vfs[cwd.value] ?? []
  const match = entries.find(e => e.startsWith(currentCmd.value.split(' ').pop() ?? ''))
  if (match) {
    const parts = currentCmd.value.split(' ')
    parts[parts.length - 1] = match
    currentCmd.value = parts.join(' ')
  }
}

onMounted(() => {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
    { threshold: .08 }
  )
  document.querySelectorAll('#lab .rv').forEach(el => obs.observe(el))
  // Focus terminal input when section is visible
  const termObs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) inputEl.value?.focus() }),
    { threshold: .5 }
  )
  const labEl = document.getElementById('lab')
  if (labEl) termObs.observe(labEl)
})
</script>

<style lang="scss" scoped>
.terminal {
  background: #010e01;
  border: 1px solid #00ff41;
  box-shadow: 0 0 40px rgba(0,255,65,.12), 0 0 80px rgba(0,255,65,.04), inset 0 0 40px rgba(0,255,65,.02);
  font-family: 'Courier New', Consolas, 'Lucida Console', monospace;
  overflow: hidden;
}

// Title bar
.term-bar {
  background: #0a1a0a;
  border-bottom: 1px solid rgba(0,255,65,.2);
  padding: 10px 18px;
  display: flex; align-items: center; gap: 12px;
}
.term-dots { display: flex; gap: 7px; }
.dot {
  width: 12px; height: 12px; border-radius: 50%;
  &.dot-r { background: #ff5f57; }
  &.dot-y { background: #febc2e; }
  &.dot-g { background: #28c840; }
}
.term-title {
  flex: 1; text-align: center;
  font-size: .7rem; color: rgba(0,255,65,.45); letter-spacing: 2px;
}
.term-ssh {
  font-size: .62rem; color: rgba(0,255,65,.3); letter-spacing: 1px;
  @media (max-width: 600px) { display: none; }
}

// Body
.term-body { padding: 20px 26px 30px; }

// Boot lines
.boot-line {
  display: flex; align-items: baseline; gap: 10px;
  font-size: .74rem; line-height: 1.85;
  opacity: 0;
  animation: termFadeIn .15s forwards;
}
@keyframes termFadeIn { to { opacity: 1; } }
.boot-ok   { color: #00ff41; min-width: 44px; flex-shrink: 0; }
.boot-info { color: #febc2e; min-width: 44px; flex-shrink: 0; }
.boot-warn { color: #ff5f57; min-width: 44px; flex-shrink: 0; }
.boot-text { color: rgba(0,255,65,.65); }

.term-divider {
  height: 1px; background: rgba(0,255,65,.1); margin: 16px 0;
}

// Prompt
.term-line {
  display: flex; align-items: center; flex-wrap: wrap;
  font-size: .82rem; margin-bottom: 4px;
}
.prompt  { color: #00ff41; font-weight: bold; }
.ps      { color: rgba(0,255,65,.35); }
.ppath   { color: #00bfff; }
.pdollar { color: rgba(0,255,65,.6); margin-right: 4px; }
.cmd     { color: #eaf4ff; }

// ls output
.ls-output { padding: 4px 0 10px 0; }
.ls-head { font-size: .72rem; color: rgba(0,255,65,.4); margin-bottom: 3px; }
.ls-row {
  display: flex; gap: 16px; font-size: .74rem; line-height: 1.9;
  .ls-perm { color: rgba(0,255,65,.35); }
  .ls-sz   { color: rgba(0,255,65,.5); min-width: 16px; text-align: right; }
  .ls-date { color: rgba(0,255,65,.35); }
  .ls-name { font-weight: bold; }
}

// Note blocks
.note-block { margin-bottom: 6px; }

.file-header {
  display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
  margin: 8px 0 6px 0;
  padding: 10px 14px;
  background: rgba(0,255,65,.03);
  border-left: 3px solid #00ff41;
}
.fh-hash  { font-size: 1rem; font-weight: 900; flex-shrink: 0; }
.fh-title { font-size: .85rem; color: #eaf4ff; font-weight: 700; flex: 1; }
.fh-meta  { font-size: .65rem; color: rgba(0,255,65,.4); letter-spacing: 1px; }

// Entry list
.entry-list { margin-left: 2px; }
.entry-item {
  border-left: 1px solid rgba(0,255,65,.1);
  margin: 2px 0;
  cursor: pointer;
  transition: border-color .15s;
  &:hover, &.expanded { border-left-color: rgba(0,255,65,.4); }
}
.entry-header {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 8px 12px;
  &:hover .eheading { color: #eaf4ff; }
}
.etoggle  { font-size: .65rem; flex-shrink: 0; transition: none; width: 12px; }
.eheading {
  flex: 1; font-size: .8rem; color: rgba(0,255,65,.85);
  letter-spacing: .5px; transition: color .15s;
}
.etag {
  font-size: .58rem; padding: 1px 8px; border: 1px solid;
  letter-spacing: 1.5px; opacity: .8;
}

// Entry body
.eslide-enter-active { transition: max-height .3s ease, opacity .25s; }
.eslide-leave-active { transition: max-height .2s ease, opacity .15s; }
.eslide-enter-from, .eslide-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
.eslide-enter-to, .eslide-leave-from { max-height: 600px; overflow: hidden; }

.entry-body {
  padding: 6px 12px 12px 24px;
  border-top: 1px dashed rgba(0,255,65,.07);
}
.eline {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: .76rem; color: rgba(0,255,65,.72); line-height: 1.95;
}
.ebullet { flex-shrink: 0; margin-top: 1px; }
.entry-md {
  margin-top: 10px; padding: 10px 14px;
  background: rgba(0,255,65,.03); border-left: 2px solid rgba(0,255,65,.15);
  font-size: .76rem; color: rgba(0,255,65,.55); line-height: 1.9;
  white-space: pre-wrap;
  font-style: italic;
}

// Final cursor line
.term-final {
  display: flex; align-items: center;
  font-size: .82rem; margin-top: 20px;
  .prompt  { color: #00ff41; font-weight: bold; }
  .ps      { color: rgba(0,255,65,.35); }
  .ppath   { color: #00bfff; }
  .pdollar { color: rgba(0,255,65,.6); margin-right: 4px; }
}
.cursor-block {
  color: #00ff41;
  animation: termBlink 1s step-end infinite;
  font-size: .85rem;
}
@keyframes termBlink { 50% { opacity: 0; } }

// Interactive terminal
.iterm {
  max-height: 260px; overflow-y: auto;
  padding: 4px 0;
  scroll-behavior: smooth;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,255,65,.2); }
}
.iterm-entry { margin-bottom: 4px; }
.iterm-cmd-line {
  display: flex; align-items: center; flex-wrap: wrap;
  font-size: .82rem; gap: 0;
  .prompt  { color: #00ff41; font-weight: bold; }
  .ps      { color: rgba(0,255,65,.35); }
  .ppath   { color: #00bfff; }
  .pdollar { color: rgba(0,255,65,.6); margin-right: 6px; }
}
.iterm-input-echo { color: #eaf4ff; letter-spacing: .5px; }
.iterm-output {
  padding: 4px 0 4px 16px;
  font-size: .78rem; line-height: 1.7;
  color: #8aaac8;
  border-left: 2px solid rgba(0,255,65,.1);
  margin: 2px 0 6px 4px;
}
.iterm-real-input {
  flex: 1; background: none; border: none; outline: none;
  color: #eaf4ff; font-family: 'Courier New', monospace;
  font-size: .82rem; letter-spacing: .5px;
  caret-color: #00ff41;
  min-width: 120px;
}

// Light theme overrides
:global(:root[data-theme='light']) {
  .terminal {
    background: #f0f7f0;
    border-color: #2d8a4e;
    box-shadow: 0 0 20px rgba(45,138,78,.1);
  }
  .term-bar { background: #e0ede0; border-bottom-color: rgba(45,138,78,.2); }
  .term-title { color: rgba(45,138,78,.5); }
  .boot-text { color: #2d5a3d; }
  .boot-ok   { color: #2d8a4e; }
  .boot-warn { color: #c0392b; }
  .boot-info { color: #e67e22; }
  .term-divider { background: rgba(45,138,78,.15); }
  .prompt  { color: #2d8a4e; }
  .ppath   { color: #1a6b9a; }
  .pdollar { color: rgba(45,138,78,.7); }
  .cmd     { color: #1a2332; }
  .ls-perm, .ls-date { color: rgba(45,138,78,.4); }
  .ls-sz   { color: rgba(45,138,78,.6); }
  .boot-text, .ls-head { color: rgba(45,138,78,.5); }
  .file-header { background: rgba(45,138,78,.04); border-left-color: #2d8a4e; }
  .fh-title { color: #1a2332; }
  .fh-meta  { color: rgba(45,138,78,.45); }
  .eheading { color: #2d5a3d; }
  .eline    { color: #3d6b4f; }
  .entry-md { color: #4a7a5a; border-left-color: rgba(45,138,78,.2); }
  .cursor-block { color: #2d8a4e; }
}
</style>
