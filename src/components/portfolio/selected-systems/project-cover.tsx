import type { ProjectCoverType } from "@/lib/portfolio/projects/types";
import { MerchantOperationsCover } from "@/components/portfolio/selected-systems/covers/merchant-operations-cover";
import { NabdMessagingCover } from "@/components/portfolio/selected-systems/covers/nabd-messaging-cover";
import { SmartVendingCover } from "@/components/portfolio/selected-systems/covers/smart-vending-cover";
import { VirtualClinicCover } from "@/components/portfolio/selected-systems/covers/virtual-clinic-cover";

interface ProjectCoverProps {
  type: ProjectCoverType;
  logoSrc?: string | null;
}

export function ProjectCover({ type, logoSrc = null }: ProjectCoverProps) {
  switch (type) {
    case "merchant-operations":
      return <MerchantOperationsCover />;
    case "messaging-router":
      return <NabdMessagingCover logoSrc={logoSrc} />;
    case "vending-device-flow":
      return <SmartVendingCover />;
    case "virtual-clinic-loop":
      return <VirtualClinicCover />;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
