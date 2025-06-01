import Slide, { SlideProps } from "@mui/material/Slide";

export default function SlidePanel({
  children,
  ...props
}: Readonly<{
  children: React.ReactElement;
}> & SlideProps) {
  return (
    <Slide
      className="absolute"
      timeout={1000}
      style={{
        transitionTimingFunction: "ease-in-out",
      }}
      {...props}
    >
      {children}
    </Slide>
  );
}
