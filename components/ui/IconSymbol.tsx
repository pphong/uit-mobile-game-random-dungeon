// Fallback for using MaterialIcons on Android and web.

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;
type IconMappingAnt = Record<SymbolViewProps['name'], ComponentProps<typeof AntDesign>['name']>;
type IconMappingMaterialCommunity = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialCommunityIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

const MAPPING_ANT = {
  'left.circle': 'caretleft',
  'right.circle': 'caretright',
} as IconMappingAnt;

const MAPPING_MC = {
  's.square.fill': 'sword-cross',
} as IconMappingMaterialCommunity;


/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <>
    {MAPPING[name] && <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />}
    {MAPPING_ANT[name] && <AntDesign color={color} size={size} name={MAPPING_ANT[name]} style={style} />}
    {MAPPING_MC[name] && <MaterialCommunityIcons name={MAPPING_MC[name]} size={size} style={style} />}
  </>;
}
