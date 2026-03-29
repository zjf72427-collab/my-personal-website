<template>
  <section id="lab" class="w">
    <div class="sh rv">
      <span class="snum">06</span>
      <h2 class="stit">HARD LAB</h2>
      <div class="sl2"></div>
    </div>

    <div class="terminal rv">
      <div class="term-bar">
        <div class="term-dots">
          <span class="dot dot-r"></span>
          <span class="dot dot-y"></span>
          <span class="dot dot-g"></span>
        </div>
        <span class="term-title">root@muz-lab - bash - 80x24</span>
        <span class="term-ssh">ssh muz@192.168.1.1</span>
      </div>

      <div class="term-body">
        <div v-for="(line, i) in bootLines" :key="i" class="boot-line" :style="{ animationDelay: i * 0.07 + 's' }">
          <span class="boot-ok" v-if="line.type === 'ok'">[ OK ]</span>
          <span class="boot-info" v-else-if="line.type === 'info'">[ ** ]</span>
          <span class="boot-warn" v-else>[ !! ]</span>
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
            <span class="ls-date">2026-03-25</span>
            <span class="ls-name" :style="{ color: lab.color }">{{ lab.dir }}/</span>
          </div>
        </div>

        <div class="iterm-tools">
          <button v-for="cmd in presetCommands" :key="cmd" type="button" class="iterm-tool" @click.stop="runPreset(cmd)">
            {{ cmd }}
          </button>
        </div>

        <div v-for="lab in labs" :key="lab.id" class="note-block">
          <div class="term-line term-note-head">
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
            <div v-for="note in lab.notes" :key="note.heading" class="entry-item" :class="{ expanded: note.open }">
              <button type="button" class="entry-header-btn" :aria-expanded="note.open" @click.stop="note.open = !note.open">
                <div class="entry-header">
                  <span class="etoggle" :style="{ color: lab.color }">{{ note.open ? 'OPEN' : 'MORE' }}</span>
                  <span class="eheading">{{ note.heading }}</span>
                  <span class="etag" :style="{ color: lab.color, borderColor: lab.color }">{{ note.tag }}</span>
                </div>
              </button>

              <transition name="eslide">
                <div v-if="note.open" class="entry-body">
                  <div v-for="ln in note.lines" :key="ln" class="eline">
                    <span class="ebullet" :style="{ color: lab.color }">+</span><span>{{ ln }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="term-divider term-tools-divider"></div>
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
interface LabNote {
  heading: string
  file: string
  tag: string
  open: boolean
  lines: string[]
}

interface Lab {
  id: string
  dir: string
  title: string
  meta: string
  color: string
  notes: LabNote[]
}

const bootLines = [
  { type: 'ok', text: 'Loaded kernel modules: vmmon, vmnet, vboxdrv' },
  { type: 'ok', text: 'Started NetworkManager - network connectivity' },
  { type: 'ok', text: 'Started OpenSSH server daemon (sshd)' },
  { type: 'info', text: 'Initializing GNS3 topology engine...' },
  { type: 'ok', text: 'Mounted /dev/sda1 on / (ext4, rw)' },
  { type: 'warn', text: 'Broadcom tg3 driver: firmware mismatch detected' },
  { type: 'ok', text: 'System ready - muz-lab login:' }
] as const

const labs = reactive<Lab[]>([
  {
    id: 'vmware',
    dir: 'vmware',
    title: 'VMware 排障手册',
    meta: '虚拟化 / 网络 / 快照 / 迁移',
    color: '#00f5ff',
    notes: [
      {
        heading: 'Workstation 17 安装与初始化',
        file: 'install.md',
        tag: 'INSTALL',
        open: false,
        lines: [
          '安装前先关闭 Hyper-V: bcdedit /set hypervisorlaunchtype off',
          'Windows 11 需要检查内核隔离和虚拟机平台开关。',
          '装完先创建基线快照，后续回滚成本会低很多。'
        ]
      },
      {
        heading: 'NAT 模式无法联网排查',
        file: 'nat-network.md',
        tag: 'NETWORK',
        open: false,
        lines: [
          '先确认 VMware DHCP Service 已启动。',
          '在 Virtual Network Editor 里恢复 VMnet8 默认配置。',
          'Guest 侧用 nmcli device status 检查网卡连接状态。'
        ]
      },
      {
        heading: '共享目录与 VMware Tools',
        file: 'shared-folder.md',
        tag: 'TOOLS',
        open: false,
        lines: [
          '推荐 open-vm-tools + open-vm-tools-desktop 组合。',
          'vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other',
          '写入 /etc/fstab 做开机自动挂载。'
        ]
      }
    ]
  },
  {
    id: 'linux',
    dir: 'linux',
    title: 'Linux 服务部署记录',
    meta: 'yum / firewall / Nginx / systemd',
    color: '#00ff88',
    notes: [
      {
        heading: 'CentOS 最小化安装后 10 分钟收敛',
        file: 'centos-init.md',
        tag: 'INIT',
        open: false,
        lines: [
          'yum update -y 后再安装基础工具链。',
          'timedatectl set-timezone Asia/Shanghai',
          '创建普通运维用户并配置 sudo 最小权限。'
        ]
      },
      {
        heading: 'firewalld 常用规则清单',
        file: 'firewall.md',
        tag: 'FIREWALL',
        open: false,
        lines: [
          'firewall-cmd --state 查看服务状态。',
          'firewall-cmd --permanent --add-port=80/tcp',
          '规则改动后必须 firewall-cmd --reload'
        ]
      },
      {
        heading: 'Nginx 反向代理与证书续签',
        file: 'nginx-ssl.md',
        tag: 'NGINX',
        open: false,
        lines: [
          'certbot --nginx -d example.com 一键签发。',
          'proxy_pass 指向本地应用并补齐 Host 头。',
          '通过 cron 周期续签并保留日志。'
        ]
      }
    ]
  },
  {
    id: 'gns3',
    dir: 'gns3',
    title: '网络仿真实战笔记',
    meta: 'OSPF / VLAN / Wireshark / tg3',
    color: '#ff006e',
    notes: [
      {
        heading: 'GNS3 VM 部署基线',
        file: 'setup.md',
        tag: 'SETUP',
        open: false,
        lines: [
          '优先使用 GNS3 VM + VMware，性能更稳。',
          '导入 OVA 后分配 4 核 CPU / 8GB RAM。',
          '首次完成后导出模板，避免重复初始化。'
        ]
      },
      {
        heading: 'Broadcom tg3 驱动排障',
        file: 'tg3-driver.md',
        tag: 'DRIVER',
        open: false,
        lines: [
          'dmesg | grep tg3 判断 firmware mismatch。',
          '安装 linux-firmware 后重载模块。',
          '必要时升级内核并重建 initramfs。'
        ]
      },
      {
        heading: 'OSPF + VLAN 联调流程',
        file: 'ospf-vlan.md',
        tag: 'ROUTING',
        open: false,
        lines: [
          '先做 area 0 邻居稳定，再扩展非骨干区。',
          'VLAN trunk 放通清单必须与交换机配置一致。',
          '抓包重点观察 Hello/Dead Interval 和 LSA 传播。'
        ]
      }
    ]
  }
])

const inputEl = ref<HTMLInputElement | null>(null)
const itermEl = ref<HTMLElement | null>(null)
const currentCmd = ref('')
const history = ref<{ cmd: string; output: string }[]>([])
const cmdHistory: string[] = []
let histIdx = -1

const presetCommands = ['help', 'ls', 'cd vmware', 'cat install.md', 'neofetch', 'clear']

const cwd = ref('~')
const vfs = computed<Record<string, string[]>>(() => ({
  '~': ['vmware/', 'linux/', 'gns3/', 'README.md'],
  '~/vmware': labs[0]?.notes.map((n) => n.file) ?? [],
  '~/linux': labs[1]?.notes.map((n) => n.file) ?? [],
  '~/gns3': labs[2]?.notes.map((n) => n.file) ?? []
}))

function findLabByCwd() {
  const dirKey = cwd.value.replace('~/', '')
  return labs.find((lab) => lab.dir === dirKey)
}

const commands: Record<string, (args: string[]) => string> = {
  help: () =>
    [
      '<span style="color:#00f5ff">Available commands:</span>',
      '  <b>ls</b>          - list directory contents',
      '  <b>cd</b> [dir]    - change directory',
      '  <b>cat</b> [file]  - display note content',
      '  <b>pwd</b>         - print working directory',
      '  <b>clear</b>       - clear terminal',
      '  <b>neofetch</b>    - system info',
      '  <b>echo</b> [text] - print text',
      '  <b>history</b>     - command history',
      '  <b>help</b>        - show this help'
    ].join('<br>'),

  ls: (args) => {
    const dir = args[0] ? `~/${args[0]}` : cwd.value
    const entries = vfs.value[dir] ?? vfs.value[cwd.value] ?? []
    if (!entries.length) return '<span style="color:#ff006e">ls: no such directory</span>'
    return entries
      .map((entry) => (entry.endsWith('/') ? `<span style="color:#00f5ff">${entry}</span>` : `<span style="color:#eaf4ff">${entry}</span>`))
      .join('  ')
  },

  pwd: () => `<span style="color:#00f5ff">${cwd.value.replace('~', '/root')}</span>`,

  cd: (args) => {
    if (!args[0] || args[0] === '~') {
      cwd.value = '~'
      return ''
    }
    const target = args[0].startsWith('~') ? args[0] : `${cwd.value}/${args[0]}`.replace('//', '/')
    const key = target.startsWith('~/') || target === '~' ? target : `~/${args[0]}`
    if (vfs.value[key] !== undefined) {
      cwd.value = key
      return ''
    }
    return `<span style="color:#ff006e">cd: ${args[0]}: No such file or directory</span>`
  },

  cat: (args) => {
    if (!args[0]) return '<span style="color:#ff006e">cat: missing operand</span>'
    if (args[0] === 'README.md') return '<span style="color:#8aaac8">// muz-lab 笔记仓库：先 ls，再 cd，最后 cat 具体文件名。</span>'

    const lab = findLabByCwd()
    if (!lab) return `<span style="color:#ff006e">cat: ${args[0]}: No such file or directory</span>`

    const note = lab.notes.find((item) => item.file === args[0])
    if (!note) return `<span style="color:#ff006e">cat: ${args[0]}: No such file or directory</span>`

    return [`<span style="color:#00f5ff"># ${note.heading}</span>`, ...note.lines.map((line) => `<span style="color:#8aaac8">  ${line}</span>`)].join('<br>')
  },

  echo: (args) => `<span style="color:#eaf4ff">${args.join(' ')}</span>`,

  clear: () => {
    history.value = []
    return '__CLEAR__'
  },

  history: () =>
    cmdHistory
      .map((cmd, i) => `<span style="color:rgba(0,245,255,.4)">${String(i + 1).padStart(3)}  </span><span style="color:#eaf4ff">${cmd}</span>`)
      .join('<br>') || '<span style="color:#8aaac8">// no history</span>',

  neofetch: () =>
    [
      '<span style="color:#00f5ff">       ___  ___  </span>  <b style="color:#eaf4ff">root@muz-lab</b>',
      '<span style="color:#00f5ff">      /   \\/   \\ </span>  <span style="color:#8aaac8">-------------</span>',
      '<span style="color:#00f5ff">     | M  | Z  |</span>  OS: CentOS 7 x86_64',
      '<span style="color:#00f5ff">      \\___/\\___/ </span>  Shell: bash 5.1.8',
      '                   Terminal: muz-lab v2.1',
      '                   CPU: Intel Core i7-12700H',
      '                   Memory: 16GB DDR5',
      `                   Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
    ].join('<br>')
}

function submitCmd() {
  const raw = currentCmd.value.trim()
  currentCmd.value = ''
  histIdx = -1
  if (!raw) return

  cmdHistory.unshift(raw)
  const [cmd, ...args] = raw.split(/\s+/)
  const fn = commands[cmd]
  const output = fn ? fn(args) : `<span style="color:#ff006e">command not found: ${cmd}. Type <b>help</b> for available commands.</span>`
  if (output === '__CLEAR__') return

  history.value.push({ cmd: raw, output })
  nextTick(() => {
    itermEl.value?.scrollTo({ top: itermEl.value.scrollHeight, behavior: 'smooth' })
    inputEl.value?.focus()
  })
}

function runPreset(cmd: string) {
  currentCmd.value = cmd
  submitCmd()
}

function historyUp() {
  if (histIdx < cmdHistory.length - 1) {
    histIdx++
    currentCmd.value = cmdHistory[histIdx]
  }
}

function historyDown() {
  if (histIdx > 0) {
    histIdx--
    currentCmd.value = cmdHistory[histIdx]
  } else {
    histIdx = -1
    currentCmd.value = ''
  }
}

function tabComplete() {
  const entries = vfs.value[cwd.value] ?? []
  const currentToken = currentCmd.value.split(' ').pop() ?? ''
  const match = entries.find((item) => item.startsWith(currentToken))
  if (match) {
    const parts = currentCmd.value.split(' ')
    parts[parts.length - 1] = match
    currentCmd.value = parts.join(' ')
  }
}

let revealObserver: IntersectionObserver | null = null
let focusObserver: IntersectionObserver | null = null

onMounted(() => {
  revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('on')),
    { threshold: 0.08 }
  )
  document.querySelectorAll('#lab .rv').forEach((el) => revealObserver?.observe(el))

  focusObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && inputEl.value?.focus()),
    { threshold: 0.5 }
  )
  const labEl = document.getElementById('lab')
  if (labEl) focusObserver.observe(labEl)
})

onUnmounted(() => {
  revealObserver?.disconnect()
  focusObserver?.disconnect()
})
</script>

<style lang="scss" scoped>
.terminal {
  background: #010e01;
  border: 1px solid #00ff41;
  box-shadow: 0 0 40px rgba(0, 255, 65, 0.12), 0 0 80px rgba(0, 255, 65, 0.04), inset 0 0 40px rgba(0, 255, 65, 0.02);
  font-family: 'Courier New', Consolas, 'Lucida Console', monospace;
  overflow: hidden;
}

.term-bar {
  background: #0a1a0a;
  border-bottom: 1px solid rgba(0, 255, 65, 0.2);
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.term-dots {
  display: flex;
  gap: 7px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.dot-r {
    background: #ff5f57;
  }

  &.dot-y {
    background: #febc2e;
  }

  &.dot-g {
    background: #28c840;
  }
}

.term-title {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(0, 255, 65, 0.45);
  letter-spacing: 1.5px;
}

.term-ssh {
  font-size: 0.62rem;
  color: rgba(0, 255, 65, 0.3);
  letter-spacing: 1px;

  @media (max-width: 600px) {
    display: none;
  }
}

.term-body {
  padding: 20px 26px 30px;
}

.boot-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 0.74rem;
  line-height: 1.85;
  opacity: 0;
  animation: termFadeIn 0.15s forwards;
}

@keyframes termFadeIn {
  to {
    opacity: 1;
  }
}

.boot-ok,
.boot-info,
.boot-warn {
  min-width: 44px;
  flex-shrink: 0;
}

.boot-ok {
  color: #00ff41;
}

.boot-info {
  color: #febc2e;
}

.boot-warn {
  color: #ff5f57;
}

.boot-text {
  color: rgba(0, 255, 65, 0.65);
}

.term-divider {
  height: 1px;
  background: rgba(0, 255, 65, 0.1);
  margin: 16px 0;
}

.term-tools-divider {
  margin-top: 24px;
  margin-bottom: 10px;
}

.term-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.82rem;
  margin-bottom: 4px;
}

.term-note-head {
  margin-top: 22px;
}

.prompt {
  color: #00ff41;
  font-weight: bold;
}

.ps {
  color: rgba(0, 255, 65, 0.35);
}

.ppath {
  color: #00bfff;
}

.pdollar {
  color: rgba(0, 255, 65, 0.6);
  margin-right: 4px;
}

.cmd {
  color: #eaf4ff;
}

.ls-output {
  padding: 4px 0 10px;
}

.ls-head {
  font-size: 0.72rem;
  color: rgba(0, 255, 65, 0.4);
  margin-bottom: 3px;
}

.ls-row {
  display: flex;
  gap: 16px;
  font-size: 0.74rem;
  line-height: 1.9;
}

.ls-perm,
.ls-date {
  color: rgba(0, 255, 65, 0.35);
}

.ls-sz {
  color: rgba(0, 255, 65, 0.5);
  min-width: 16px;
  text-align: right;
}

.ls-name {
  font-weight: bold;
}

.note-block {
  margin-bottom: 6px;
}

.file-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  margin: 8px 0 6px;
  padding: 10px 14px;
  background: rgba(0, 255, 65, 0.03);
  border-left: 3px solid #00ff41;
}

.fh-hash {
  font-size: 1rem;
  font-weight: 900;
  flex-shrink: 0;
}

.fh-title {
  font-size: 0.85rem;
  color: #eaf4ff;
  font-weight: 700;
  flex: 1;
}

.fh-meta {
  font-size: 0.65rem;
  color: rgba(0, 255, 65, 0.4);
  letter-spacing: 1px;
}

.entry-list {
  margin-left: 2px;
}

.entry-item {
  border-left: 1px solid rgba(0, 255, 65, 0.1);
  margin: 2px 0;
  transition: border-color 0.15s;

  &:hover,
  &.expanded {
    border-left-color: rgba(0, 255, 65, 0.4);
  }
}

.entry-header-btn {
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgba(0, 255, 65, 0.7);
    outline-offset: -2px;
  }
}

.entry-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 12px;
}

.etoggle {
  font-size: 0.58rem;
  flex-shrink: 0;
  width: 36px;
}

.eheading {
  flex: 1;
  font-size: 0.8rem;
  color: rgba(0, 255, 65, 0.85);
  letter-spacing: 0.5px;
  transition: color 0.15s;
}

.etag {
  font-size: 0.58rem;
  padding: 1px 8px;
  border: 1px solid;
  letter-spacing: 1.5px;
  opacity: 0.8;
}

.eslide-enter-active {
  transition: max-height 0.3s ease, opacity 0.25s;
}

.eslide-leave-active {
  transition: max-height 0.2s ease, opacity 0.15s;
}

.eslide-enter-from,
.eslide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.eslide-enter-to,
.eslide-leave-from {
  max-height: 600px;
  overflow: hidden;
}

.entry-body {
  padding: 6px 12px 12px 24px;
  border-top: 1px dashed rgba(0, 255, 65, 0.07);
}

.eline {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.76rem;
  color: rgba(0, 255, 65, 0.72);
  line-height: 1.95;
}

.ebullet {
  flex-shrink: 0;
  margin-top: 1px;
}

.iterm-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.iterm-tool {
  border: 1px solid rgba(0, 255, 65, 0.3);
  background: rgba(0, 255, 65, 0.05);
  color: rgba(0, 255, 65, 0.82);
  font-family: 'Courier New', monospace;
  font-size: 0.68rem;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: rgba(0, 255, 65, 0.12);
    border-color: rgba(0, 255, 65, 0.6);
  }
}

.iterm {
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 65, 0.2);
  }
}

.iterm-entry {
  margin-bottom: 4px;
}

.iterm-cmd-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.82rem;
}

.iterm-input-echo {
  color: #eaf4ff;
  letter-spacing: 0.5px;
}

.iterm-output {
  padding: 4px 0 4px 16px;
  font-size: 0.78rem;
  line-height: 1.7;
  color: #8aaac8;
  border-left: 2px solid rgba(0, 255, 65, 0.1);
  margin: 2px 0 6px 4px;
}

.iterm-real-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #eaf4ff;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.5px;
  caret-color: #00ff41;
  min-width: 120px;
}

:global(:root[data-theme='light']) {
  .terminal {
    background: #f0f7f0;
    border-color: #2d8a4e;
    box-shadow: 0 0 20px rgba(45, 138, 78, 0.1);
  }

  .term-bar {
    background: #e0ede0;
    border-bottom-color: rgba(45, 138, 78, 0.2);
  }

  .term-title {
    color: rgba(45, 138, 78, 0.5);
  }

  .boot-text {
    color: #2d5a3d;
  }

  .boot-ok {
    color: #2d8a4e;
  }

  .boot-warn {
    color: #c0392b;
  }

  .boot-info {
    color: #e67e22;
  }

  .term-divider {
    background: rgba(45, 138, 78, 0.15);
  }

  .prompt {
    color: #2d8a4e;
  }

  .ppath {
    color: #1a6b9a;
  }

  .pdollar {
    color: rgba(45, 138, 78, 0.7);
  }

  .cmd,
  .fh-title {
    color: #1a2332;
  }

  .ls-perm,
  .ls-date,
  .ls-head {
    color: rgba(45, 138, 78, 0.45);
  }

  .ls-sz {
    color: rgba(45, 138, 78, 0.6);
  }

  .file-header {
    background: rgba(45, 138, 78, 0.04);
    border-left-color: #2d8a4e;
  }

  .fh-meta {
    color: rgba(45, 138, 78, 0.45);
  }

  .eheading {
    color: #2d5a3d;
  }

  .eline {
    color: #3d6b4f;
  }

  .iterm-tool {
    color: #2d8a4e;
    border-color: rgba(45, 138, 78, 0.35);
    background: rgba(45, 138, 78, 0.07);
  }
}
</style>
