import React, { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  uri: string;
  fallback: number;
  style: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  onPhotoStatus?: (loaded: boolean) => void;
}

/** Always paints the bundled artwork first; a downloaded photo only replaces it after loading. */
export function AuctionArtworkImage({ uri, fallback, style, accessibilityLabel, onPhotoStatus }: Props) {
  const [loadedUri, setLoadedUri] = useState<string | null>(null);
  useEffect(() => { setLoadedUri(null); onPhotoStatus?.(false); }, [uri, onPhotoStatus]);

  return <View style={style}>
    <Image source={fallback} resizeMode="cover" style={StyleSheet.absoluteFill} accessibilityLabel={accessibilityLabel} />
    <Image
      source={{ uri }}
      resizeMode="cover"
      style={[StyleSheet.absoluteFill, loadedUri === uri ? styles.visibleRemote : styles.hiddenRemote]}
      accessibilityLabel={accessibilityLabel}
      onLoad={() => { setLoadedUri(uri); onPhotoStatus?.(true); }}
      onError={() => { setLoadedUri(null); onPhotoStatus?.(false); }}
    />
  </View>;
}

const styles = StyleSheet.create({ hiddenRemote: { opacity: 0 }, visibleRemote: { opacity: 1 } });
