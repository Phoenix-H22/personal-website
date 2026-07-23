import {
  isPortfolioVersionSwitchEnabled,
  type PortfolioVariant,
} from "@/lib/portfolio/portfolio-variant";

interface PortfolioVersionSwitchGateProps {
  active: PortfolioVariant;
}

/**
 * Server gate: when the env flag is off, render nothing and do not load the
 * client switch module. When on, dynamically import the client control.
 */
export async function PortfolioVersionSwitchGate({
  active,
}: PortfolioVersionSwitchGateProps) {
  if (!isPortfolioVersionSwitchEnabled()) {
    return null;
  }

  const { PortfolioVersionSwitch } = await import(
    "@/components/portfolio/portfolio-version-switch"
  );
  return <PortfolioVersionSwitch active={active} />;
}
