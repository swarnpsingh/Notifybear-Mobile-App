import React from 'react';
import { Text, TextStyle, View } from 'react-native';

interface GradientTextProps {
  children: string;
  style?: TextStyle;
  colors?: string[];
}

const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  style, 
  colors = ['#007BFF', '#FFB6C1'] 
}) => {
  // Simple gradient simulation using multiple text components
  const textLength = children.length;
  const chars = children.split('');
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {chars.map((char, index) => {
        const progress = index / (textLength - 1);
        const color = interpolateColor(colors[0], colors[1], progress);
        
        return (
          <Text
            key={index}
            style={[
              style,
              { color }
            ]}
          >
            {char}
          </Text>
        );
      })}
    </View>
  );
};

// Simple color interpolation function
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default GradientText; 