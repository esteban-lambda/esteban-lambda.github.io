import { toast as hotToast } from 'react-hot-toast';
import './CustomToast.css';

const CustomToast = ({ t, type = 'success', title, message }) => {
  const config = {
    success: {
      waveFill: '#04e4003a',
      iconBg: '#04e40048',
      iconColor: '#269b24',
      titleColor: '#269b24',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          strokeWidth="0"
          fill="currentColor"
          stroke="currentColor"
          className="icon"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
        </svg>
      )
    },
    error: {
      waveFill: '#ff00003a',
      iconBg: '#ff000048',
      iconColor: '#d32f2f',
      titleColor: '#d32f2f',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          strokeWidth="0"
          fill="currentColor"
          stroke="currentColor"
          className="icon"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
        </svg>
      )
    },
    warning: {
      waveFill: '#ff99003a',
      iconBg: '#ff990048',
      iconColor: '#f57c00',
      titleColor: '#f57c00',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          strokeWidth="0"
          fill="currentColor"
          stroke="currentColor"
          className="icon"
        >
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
      )
    },
    info: {
      waveFill: '#2196f33a',
      iconBg: '#2196f348',
      iconColor: '#1976d2',
      titleColor: '#1976d2',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          strokeWidth="0"
          fill="currentColor"
          stroke="currentColor"
          className="icon"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      )
    }
  };

  const currentConfig = config[type] || config.success;

  return (
    <div className={`custom-toast ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
      <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
          fill={currentConfig.waveFill}
        />
      </svg>

      <div className="icon-container" style={{ backgroundColor: currentConfig.iconBg }}>
        <div style={{ color: currentConfig.iconColor }}>
          {currentConfig.icon}
        </div>
      </div>

      <div className="message-text-container">
        <p className="message-text" style={{ color: currentConfig.titleColor }}>
          {title}
        </p>
        <p className="sub-text">{message}</p>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 15"
        strokeWidth="0"
        fill="none"
        stroke="currentColor"
        className="cross-icon"
        onClick={() => hotToast.dismiss(t.id)}
      >
        <path
          fill="currentColor"
          d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
};

export const toast = {
  success: (message, title = 'Éxito') => {
    hotToast.custom((t) => (
      <CustomToast t={t} type="success" title={title} message={message} />
    ), {
      duration: 4000,
      position: 'top-right'
    });
  },
  error: (message, title = 'Error') => {
    hotToast.custom((t) => (
      <CustomToast t={t} type="error" title={title} message={message} />
    ), {
      duration: 4000,
      position: 'top-right'
    });
  },
  warning: (message, title = 'Advertencia') => {
    hotToast.custom((t) => (
      <CustomToast t={t} type="warning" title={title} message={message} />
    ), {
      duration: 4000,
      position: 'top-right'
    });
  },
  info: (message, title = 'Información') => {
    hotToast.custom((t) => (
      <CustomToast t={t} type="info" title={title} message={message} />
    ), {
      duration: 4000,
      position: 'top-right'
    });
  }
};

export default CustomToast;
