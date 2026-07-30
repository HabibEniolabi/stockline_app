import * as React from "react"
import { SVGProps } from "react"

interface StockWaveProps extends SVGProps<SVGSVGElement> {
    color?: string;
}
const StockWave = ({color= "#3E52C1", ...props}: StockWaveProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fill={color}
      d="m11.207 32.16 20.476-20.476-3.367-3.368L7.84 28.793l3.367 3.367ZM19.303 11.684l-8.096 8.095-3.367-3.367 8.095-8.096 3.368 3.367ZM23.588 32.16l8.095-8.095-3.367-3.368-8.095 8.096 3.367 3.367Z"
    />
    <path
      fill={color}
      fillRule="evenodd"
      d="M0 40V0h40v40H0ZM4.762 4.762h30.476v30.476H4.762V4.762Z"
      clipRule="evenodd"
    />
  </svg>
)
export default StockWave
