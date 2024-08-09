declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL: string;
    S3_REGION: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
