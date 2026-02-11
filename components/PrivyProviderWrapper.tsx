/**
 * 钱包体系：Privy 社交登录 + Embedded Wallet
 * 配置 VITE_PRIVY_APP_ID 后生效；未配置时仅渲染 children（匿名/游客模式照常）
 */
import React from 'react';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID?.trim()) {
    return <>{children}</>;
  }

  try {
    const { PrivyProvider } = require('@privy-io/react-auth');
    return (
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ['email', 'google', 'twitter'],
          appearance: { theme: 'dark', accentColor: '#f59e0b' },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        {children}
      </PrivyProvider>
    );
  } catch {
    return <>{children}</>;
  }
}
