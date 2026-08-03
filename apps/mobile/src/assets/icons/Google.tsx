import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const Google = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#FBBB00"
        d="m4.432 12.086-.696 2.6-2.544.053A9.956 9.956 0 0 1 0 10a9.95 9.95 0 0 1 1.118-4.599l2.266.415.992 2.252A5.944 5.944 0 0 0 4.056 10c0 .734.133 1.438.376 2.086Z"
      />
      <Path
        fill="#518EF8"
        d="M19.825 8.132a10.018 10.018 0 0 1-.044 3.956 9.997 9.997 0 0 1-3.52 5.71h-.001l-2.853-.146-.404-2.52a5.96 5.96 0 0 0 2.564-3.044H10.22V8.132h9.605Z"
      />
      <Path
        fill="#28B446"
        d="M16.26 17.798A9.958 9.958 0 0 1 10 20a9.999 9.999 0 0 1-8.808-5.26l3.24-2.654a5.946 5.946 0 0 0 8.57 3.045l3.258 2.667Z"
      />
      <Path
        fill="#F14336"
        d="m16.383 2.302-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114L1.12 5.401A9.998 9.998 0 0 1 10 0c2.427 0 4.651.864 6.383 2.302Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Google
