package com.tonight.app.ui.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.Random
import kotlin.math.sin

enum class SoundscapeType {
    NONE,
    CALM_RAIN,
    WARM_FIREPLACE,
    NIGHT_BREEZE
}

/**
 * AmbientSoundscapeManager:
 * Generates continuous soothing low-volume acoustic textures entirely offline using AudioTrack synthesis.
 * Zero assets, zero permissions, zero network calls.
 */
object AmbientSoundscapeManager {
    private var audioTrack: AudioTrack? = null
    private var playbackJob: Job? = null
    private var currentType = SoundscapeType.NONE

    fun play(type: SoundscapeType, scope: CoroutineScope) {
        if (type == currentType && audioTrack != null) return
        stop()

        if (type == SoundscapeType.NONE) return
        currentType = type

        val sampleRate = 22050
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        ).coerceAtLeast(4096)

        try {
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            audioTrack?.play()

            playbackJob = scope.launch(Dispatchers.Default) {
                val buffer = ShortArray(bufferSize / 2)
                val random = Random()
                var b0 = 0.0
                var b1 = 0.0
                var b2 = 0.0
                var phase = 0.0

                while (isActive) {
                    when (type) {
                        SoundscapeType.CALM_RAIN -> {
                            // Pink noise filtered for steady rain drop rhythm
                            for (i in buffer.indices) {
                                val white = random.nextGaussian()
                                b0 = 0.99886 * b0 + white * 0.0555179
                                b1 = 0.99332 * b1 + white * 0.0750759
                                b2 = 0.96900 * b2 + white * 0.1538520
                                val pink = (b0 + b1 + b2 + white * 0.05362) * 800.0
                                buffer[i] = pink.toInt().coerceIn(-32768, 32767).toShort()
                            }
                        }
                        SoundscapeType.WARM_FIREPLACE -> {
                            // Soft warm rumble with occasional crackle pops
                            for (i in buffer.indices) {
                                phase += 0.015
                                val lowDrone = sin(phase) * 500.0
                                val crackle = if (random.nextFloat() > 0.997f) (random.nextInt(6000) - 3000) else 0
                                val sample = (lowDrone + crackle + random.nextGaussian() * 200.0)
                                buffer[i] = sample.toInt().coerceIn(-32768, 32767).toShort()
                            }
                        }
                        SoundscapeType.NIGHT_BREEZE -> {
                            // Gentle oscillating binaural breeze
                            for (i in buffer.indices) {
                                phase += 0.008
                                val swell = (sin(phase * 0.1) + 1.0) * 0.5
                                val white = random.nextGaussian()
                                b0 = 0.995 * b0 + white * 0.05
                                val sample = (b0 * 1200.0 * swell)
                                buffer[i] = sample.toInt().coerceIn(-32768, 32767).toShort()
                            }
                        }
                        SoundscapeType.NONE -> break
                    }

                    audioTrack?.write(buffer, 0, buffer.size)
                }
            }
        } catch (_: Exception) {
            stop()
        }
    }

    fun stop() {
        currentType = SoundscapeType.NONE
        playbackJob?.cancel()
        playbackJob = null
        try {
            audioTrack?.pause()
            audioTrack?.flush()
            audioTrack?.release()
        } catch (_: Exception) {}
        audioTrack = null
    }
}
