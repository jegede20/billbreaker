import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'BillBreaker — Find out which appliance is consuming your light bill.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFBF2',
          padding: '64px',
          color: '#1F2937',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Brand Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg
              width="52"
              height="48"
              viewBox="2 1 30 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6H18L13 17H19L14 26H4Z" fill="#1F2937" />
              <path d="M20 4H30V24H16L21 15H15Z" fill="#F59E0B" />
            </svg>
            <div
              style={{
                display: 'flex',
                fontSize: '42px',
                letterSpacing: '-0.02em',
                color: '#1F2937',
              }}
            >
              <span style={{ fontWeight: 500 }}>Bill</span>
              <span style={{ fontWeight: 800 }}>Breaker</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 22px',
              borderRadius: '999px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #F0E7D3',
              fontSize: '20px',
              fontWeight: 700,
              color: '#1F2937',
            }}
          >
            Free · No signup · Works offline
          </div>
        </div>

        {/* Middle Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '980px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#1F2937',
            }}
          >
            Find out which appliance is consuming your light bill.
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 500,
              color: '#6B7280',
              lineHeight: 1.35,
            }}
          >
            Break down your monthly power cost by appliance and see which
            changes save the most money.
          </div>
        </div>

        {/* Bottom Stacked Bill-Breaker Bar Preview */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #F0E7D3',
            borderRadius: '24px',
            padding: '24px 32px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '22px',
              fontWeight: 700,
            }}
          >
            <span>AC 40% · Freezer 20% · Fans 15% · TV 10% · Lighting 7%</span>
            <span style={{ color: '#15803D' }}>Save up to 27% / month</span>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '28px',
              borderRadius: '12px',
              overflow: 'hidden',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '40%',
                height: '100%',
                backgroundColor: '#EF4444',
                borderRadius: '8px 0 0 8px',
              }}
            />
            <div
              style={{
                width: '20%',
                height: '100%',
                backgroundColor: '#F59E0B',
              }}
            />
            <div
              style={{
                width: '15%',
                height: '100%',
                backgroundColor: '#1F2937',
              }}
            />
            <div
              style={{
                width: '10%',
                height: '100%',
                backgroundColor: '#FBBF24',
              }}
            />
            <div
              style={{
                width: '7%',
                height: '100%',
                backgroundColor: '#16A34A',
              }}
            />
            <div
              style={{
                width: '8%',
                height: '100%',
                backgroundColor: '#6B7280',
                borderRadius: '0 8px 8px 0',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
