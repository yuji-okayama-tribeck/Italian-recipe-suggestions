'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface SteamAnimationProps {
  isVisible: boolean
  onAnimationComplete?: () => void
  duration?: number // アニメーション表示時間（ミリ秒）
}

export function SteamAnimation({ 
  isVisible, 
  onAnimationComplete, 
  duration = 3000 
}: SteamAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true)

      const timer = setTimeout(() => {
        setShowAnimation(false)
        onAnimationComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onAnimationComplete])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative">
        {/* Buonoくん成功画像 */}
        <div className="relative animate-fade-in-up">
          <Image 
            src="/images/buono-kun-recipe-success-2.png" 
            alt="レシピ完成のBuonoくん" 
            width={400}
            height={400}
            className="mx-auto" 
          />
          
          {/* 湯気のアニメーション - Buonoくんの上部に表示 */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-56 h-40">
            {/* 特大湯気パーティクル */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`steam-xlarge-${index}`}
                className="absolute w-8 h-8 bg-white/95 rounded-full blur-sm"
                style={{
                  left: `${40 + Math.sin(index * 2.094) * 20}%`,
                  bottom: '0%',
                  animation: `steam-xlarge 3.5s infinite ease-out ${index * 0.6}s`,
                }}
              />
            ))}
            {/* 大きな湯気パーティクル */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`steam-large-${index}`}
                className="absolute w-6 h-6 bg-white/90 rounded-full blur-sm"
                style={{
                  left: `${35 + Math.sin(index * 1.256) * 30}%`,
                  bottom: '5%',
                  animation: `steam-large 3s infinite ease-out ${index * 0.3}s`,
                }}
              />
            ))}
            {/* 中サイズの湯気パーティクル（層1） */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`steam-medium-1-${index}`}
                className="absolute w-4 h-4 bg-white/85 rounded-full blur-sm"
                style={{
                  left: `${25 + Math.sin(index * 0.785) * 35}%`,
                  bottom: '15%',
                  animation: `steam-medium 2.5s infinite ease-out ${index * 0.2 + 0.1}s`,
                }}
              />
            ))}
            {/* 中サイズの湯気パーティクル（層2） */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`steam-medium-2-${index}`}
                className="absolute w-5 h-5 bg-white/80 rounded-full blur-sm"
                style={{
                  left: `${30 + Math.cos(index * 0.628) * 32}%`,
                  bottom: '20%',
                  animation: `steam-medium 2.2s infinite ease-out ${index * 0.25 + 0.3}s`,
                }}
              />
            ))}
            {/* 小さな湯気パーティクル（層1） */}
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={`steam-small-1-${index}`}
                className="absolute w-3 h-3 bg-white/75 rounded-full"
                style={{
                  left: `${20 + Math.sin(index * 0.349) * 40}%`,
                  bottom: '30%',
                  animation: `steam-small 2s infinite ease-out ${index * 0.12 + 0.4}s`,
                }}
              />
            ))}
            {/* 小さな湯気パーティクル（層2） */}
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={`steam-small-2-${index}`}
                className="absolute w-3 h-3 bg-white/70 rounded-full"
                style={{
                  left: `${22 + Math.cos(index * 0.419) * 38}%`,
                  bottom: '35%',
                  animation: `steam-small 1.8s infinite ease-out ${index * 0.15 + 0.6}s`,
                }}
              />
            ))}
            {/* 微細な湯気パーティクル（層1） */}
            {Array.from({ length: 25 }).map((_, index) => (
              <div
                key={`steam-tiny-1-${index}`}
                className="absolute w-2 h-2 bg-white/65 rounded-full"
                style={{
                  left: `${15 + Math.sin(index * 0.251) * 45}%`,
                  bottom: '45%',
                  animation: `steam-tiny 1.5s infinite ease-out ${index * 0.08 + 0.7}s`,
                }}
              />
            ))}
            {/* 微細な湯気パーティクル（層2） */}
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={`steam-tiny-2-${index}`}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${18 + Math.cos(index * 0.314) * 42}%`,
                  bottom: '50%',
                  animation: `steam-tiny 1.3s infinite ease-out ${index * 0.1 + 0.9}s`,
                }}
              />
            ))}
            {/* 超微細な湯気パーティクル */}
            {Array.from({ length: 30 }).map((_, index) => (
              <div
                key={`steam-micro-${index}`}
                className="absolute w-1 h-1 bg-white/55 rounded-full"
                style={{
                  left: `${10 + Math.sin(index * 0.209) * 50}%`,
                  bottom: '55%',
                  animation: `steam-micro 1.2s infinite ease-out ${index * 0.06 + 1.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 完成メッセージ */}
        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-white/95 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-italian-red mb-1">
              Buonissimo!
            </h3>
            <p className="text-gray-600 text-sm">
              美味しいレシピが完成しました！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
