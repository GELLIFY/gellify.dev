"use client"

import type { ReactNode } from "react" // Added import for React
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  type NodeTypes,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "reactflow"
import { Card } from "@/components/ui/card"
import {
  LockIcon,
  ServerIcon,
  LayoutDashboardIcon,
  CloudIcon,
  DatabaseIcon,
  MonitorIcon,
  FunctionSquareIcon,
  Atom,
} from "lucide-react"
import "reactflow/dist/style.css"

const ContainerNode = ({ data }: { data: { label: string; icon?: ReactNode; subtitle?: string } }) => {
  return (
    <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          {data.icon}
          <span className="font-medium">{data.label}</span>
      </div>
      {data.subtitle && <span className="text-xs text-muted-foreground">{data.subtitle}</span>}

    </div>
  )
}

const CustomNode = ({ data }: { data: { label: string; icon?: ReactNode; subtitle?: string } }) => {
  return (
    <Card className="px-4 py-2 min-w-[200px] bg-background border-primary/20">
      <div className="flex flex-col gap-1">
      <Handle type="target" position={Position.Left} />
        <div className="flex items-center gap-2">
          {data.icon}
          <span className="font-medium">{data.label}</span>
        </div>
        {data.subtitle && <span className="text-xs text-muted-foreground">{data.subtitle}</span>}
        <Handle type="source" position={Position.Right} />
      </div>
    </Card>
  )
}

const nodeTypes: NodeTypes = {
  container: ContainerNode,
  custom: CustomNode,

}

const initialNodes: Node[] = [
  // {
  //   id: "user",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   style: {
  //     width: 250
  //   },
  //   data: {
  //     label: "Request",
  //     icon: <FunctionSquareIcon className="w-4 h-4" />,
  //     subtitle: "User",
  //   },
  // },
  // Cloud Layer (Vercel)
  {
    id: "vercel-group",
    type: "container",
    position: { x: 0, y: 120 },
    style: {
      width: 300,
      height: 200,
      backgroundColor: "rgba(186, 230, 253, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(186, 230, 253, 0.2)",
      padding: "8px",
    },
    data: {
      label: "Vercel",
      icon: <CloudIcon className="w-4 h-4 text-sky-500" />,
      subtitle: "Edge Network & Serverless Functions",
    },
  },
  // Route Handlers
  {
    id: "nextjs",
    type: "custom",
    position: { x: 20, y: 100 },
    parentNode: "vercel-group",
    style: {
      width: 250
    },
    data: {
      label: "Next.js",
      icon: <FunctionSquareIcon className="w-4 h-4" />,
      subtitle: "Route Handlers, Server Actions, RSC",
    },
  },
  // Clerk
  {
    id: "clerk",
    type: "custom",
    position: { x: 500, y: 0 },
    data: {
      label: "Clerk",
      icon: (
        <div className="w-4 h-4 bg-[#7453F3] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">C</span>
        </div>
      ),
      subtitle: "Managed Authentication (AUTH Layer)",
    },
  },
  // Neon
  // Cloud Layer (Azure)
  {
    id: "azure-group",
    type: "container",
    position: { x: 450, y: 120 },
    style: {
      width: 300,
      height: 200,
      backgroundColor: "rgba(186, 230, 253, 0.1)",
      borderRadius: "12px",
      border: "1px solid rgba(186, 230, 253, 0.2)",
      padding: "8px",
    },
    data: {
      label: "Azure",
      icon: <CloudIcon className="w-4 h-4 text-sky-500" />,
      subtitle: "Azure Cloud",
    },
  },
  {
    id: "neon",
    type: "custom",
    position: { x: 20, y: 100 },
    parentNode: "azure-group",
    data: {
      label: "Neon Database",
      icon: <DatabaseIcon className="w-4 h-4 text-emerald-500" />,
      subtitle: "Serverless Postgres on Azure (DATA Layer)",
    },
  },
]

const initialEdges: Edge[] = [
  // Auth flow
  {
    id: "nextjs-clerk",
    source: "nextjs",
    target: "clerk",
    animated: true,
    style: { stroke: "#7453F3" },
    markerStart: { type: MarkerType.Arrow },
    markerEnd: { type: MarkerType.Arrow },
    label: "Auth Validation",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#020817", color: "white" },
    labelStyle: { fill: "white" },
  },
  // Data flow
  {
    id: "nextjs-neon",
    source: "nextjs",
    target: "neon",
    animated: true,
    label: "Drizzle ORM",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#020817", color: "white" },
    labelStyle: { fill: "white" },
    style: { stroke: "#00E699" },
    markerEnd: { type: MarkerType.Arrow },
  },
]

export default function ArchitectureDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[500px] bg-background border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        draggable={false}
        nodesDraggable={false}
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="bg-background/50 p-2 rounded-lg backdrop-blur">
          <div className="space-y-2">
            <h3 className="font-semibold">Application Architecture</h3>
            <div className="text-xs text-muted-foreground">
              Next.js application deployed on Vercel with Clerk authentication and Neon database
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

