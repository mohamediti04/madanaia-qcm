import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from './theme';
import { KEYS, formatTime } from './utils';

export default function QuizScreen({
  quiz,
  answers,
  current,
  mode,
  elapsed,
  muted,
  onSelect,
  onPrev,
  onNext,
  onQuit,
  onToggleMute,
  onSpeak,
}) {
  const q = quiz[current];
  const ans = answers[current];
  const total = quiz.length;
  if (!q || !ans) return null;

  const locked = mode === 'practice' && ans.selected !== null;
  const progress = ((current + 1) / total) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.headRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Ø§Ù„Ø³Ø¤Ø§Ù„ {current + 1} Ù…Ù† {total}</Text>
          </View>
          <View style={[styles.pill, styles.pillCat]}>
            <Text style={[styles.pillText, { color: colors.primary }]}>{q.cat}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{formatTime(elapsed)}</Text>
          </View>
          <TouchableOpacity style={[styles.pill, styles.mutePill, muted && styles.mutePillOff]} onPress={onToggleMute}>
            <Text style={[styles.pillText, muted && { color: colors.muted }]}>
              {muted ? 'ðŸ”‡ Ø§Ù„ØµÙˆØª Ù…ÙƒØªÙˆÙ…' : 'ðŸ”Š Ø§Ù„ØµÙˆØª'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.qText} onPress={() => onSpeak(q.q)}>
          {q.q}
        </Text>

        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => onSpeak(q.q)} activeOpacity={0.8}>
          <Text style={styles.btnGhostText}>ðŸ”Š Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø³Ø¤Ø§Ù„ ØµÙˆØªÙŠØ§Ù‹</Text>
        </TouchableOpacity>

        <View style={styles.options}>
          {q.options.map((opt, i) => {
            const styleArr = [styles.option];
            if (locked) {
              if (i === q.correctIndex) styleArr.push(styles.optionCorrect);
              else if (i === ans.selected) styleArr.push(styles.optionWrong);
            } else if (i === ans.selected) {
              styleArr.push(styles.optionSelected);
            }
            const keyStyleArr = [styles.key];
            const textStyleArr = [styles.optionText];
            if (locked && i === q.correctIndex) {
              keyStyleArr.push(styles.keyCorrect);
              textStyleArr.push({ color: colors.ok });
            } else if (locked && i === ans.selected) {
              keyStyleArr.push(styles.keyWrong);
              textStyleArr.push({ color: colors.bad });
            }
            return (
              <TouchableOpacity
                key={i}
                type="button"
                style={styleArr}
                disabled={locked}
                onPress={() => onSelect(i)}
                activeOpacity={0.75}
              >
                <View style={keyStyleArr}>
                  <Text style={[styles.keyText, locked && i === q.correctIndex && { color: '#fff' }, locked && i === ans.selected && i !== q.correctIndex && { color: '#fff' }]}>
                    {KEYS[i] || i + 1}
                  </Text>
                </View>
                <Text style={textStyleArr}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {locked && (
          <View style={[styles.explain, { backgroundColor: ans.selected === q.correctIndex ? colors.okBg : colors.badBg }]}>
            <Text style={styles.explainText}>
              {ans.selected === q.correctIndex ? 'âœ… Ø¥Ø¬Ø§Ø¨Ø© ØµØ­ÙŠØ­Ø©.' : 'âŒ Ø¥Ø¬Ø§Ø¨Ø© Ø®Ø§Ø·Ø¦Ø©.'}
              <Text style={{ fontWeight: '800' }}> Ø§Ù„ØªÙˆØ¶ÙŠØ­:</Text> {q.exp}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnGhost, current === 0 && styles.btnDisabled]}
            disabled={current === 0}
            onPress={onPrev}
          >
            <Text style={styles.btnGhostText}>â†’ Ø§Ù„Ø³Ø§Ø¨Ù‚</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onQuit}>
            <Text style={styles.btnGhostText}>Ø®Ø±ÙˆØ¬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOk]} onPress={onNext}>
            <Text style={styles.btnOkText}>{current === total - 1 ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø§Ù„Ù†ØªÙŠØ¬Ø©' : 'Ø§Ù„ØªØ§Ù„ÙŠ â†'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  headRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  pill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillCat: { backgroundColor: colors.primaryLight, borderColor: '#cfe8e2' },
  pillText: { fontSize: 11, fontWeight: '700', color: colors.ink },
  mutePill: { backgroundColor: '#eef2ff', borderColor: '#dbeafe' },
  mutePillOff: { backgroundColor: '#f1f5f9' },
  progressTrack: {
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 999,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: colors.primary2, borderRadius: 999 },
  qText: {
    fontSize: 16,
    lineHeight: 28,
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 16,
  },
  btn: { borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', paddingHorizontal: 14 },
  btnGhost: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: colors.line, marginTop: 12 },
  btnGhostText: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  btnDisabled: { opacity: 0.4 },
  options: { marginTop: 14, gap: 10 },
  option: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 12,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionCorrect: { borderColor: colors.ok, backgroundColor: colors.okBg },
  optionWrong: { borderColor: colors.bad, backgroundColor: colors.badBg },
  key: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyCorrect: { backgroundColor: colors.ok, borderColor: colors.ok },
  keyWrong: { backgroundColor: colors.bad, borderColor: colors.bad },
  keyText: { fontSize: 13, fontWeight: '800', color: colors.ink },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  explain: { borderRadius: radius.md, padding: 12, marginTop: 14 },
  explainText: { fontSize: 13, lineHeight: 22, color: colors.ink, textAlign: 'right', writingDirection: 'rtl' },
  actions: { flexDirection: 'row-reverse', gap: 8, marginTop: 18 },
  btnOk: { backgroundColor: colors.ok, flex: 1 },
  btnOkText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

