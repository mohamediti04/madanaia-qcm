import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { QUESTIONS } from '../data/questions';
import { colors, radius } from './theme';

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      type="button"
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SwitchRow({ label, value, onValueChange, disabled }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#cbd5e1', true: colors.primary2 }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

export default function SetupScreen({ total, cfg, setCfg, onStart, onOpenPdf, onOpenArticles }) {
  const cats = useMemo(() => {
    const m = new Map();
    QUESTIONS.forEach((q) => m.set(q.cat, (m.get(q.cat) || 0) + 1));
    return [...m.entries()];
  }, []);

  const counts = [10, 15, 20, 30, 40, 0];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Ø§Ù„Ø¬Ø±ÙŠØ¯Ø© Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø¹Ø¯Ø¯ 7485 â€” Ù‚Ø§Ù†ÙˆÙ† Ø±Ù‚Ù… 58.25</Text>
        </View>
        <Text style={styles.title}>Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±Ø§Øª (QCM)</Text>
        <Text style={styles.subtitle}>
          Ø§Ù„ØªØºØ·ÙŠØ© Ø§Ù„ÙƒØ§Ù…Ù„Ø©: Ø§Ù„Ù…Ø§Ø¯Ø© 1 Ø¥Ù„Ù‰ 644 â€” ÙˆØ«ÙŠÙ‚Ø© <Text style={{ fontWeight: '800' }}>procedure.pdf</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø±Ø©</Text>
        <Text style={styles.hint}>Ø§Ø®ØªØ± Ø§Ù„Ù…Ø­Ø§ÙˆØ± ÙˆØ¹Ø¯Ø¯ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø«Ù… Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ Ø²Ø± Ø§Ù„ØªÙˆÙ„ÙŠØ¯ Ø§Ù„Ø¹Ø´ÙˆØ§Ø¦ÙŠ.</Text>

        <Text style={styles.fieldLabel}>Ø§Ù„Ù…Ø­ÙˆØ± / Ø§Ù„Ù…Ù‚Ø·Ø¹</Text>
        <View style={styles.chipsWrap}>
          <Chip
            label={`ÙƒÙ„ Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹ (${total})`}
            active={cfg.cats === 'all'}
            onPress={() => setCfg({ ...cfg, cats: 'all' })}
          />
          {cats.map(([c, n]) => (
            <Chip
              key={c}
              label={`${c} (${n})`}
              active={cfg.cats === c}
              onPress={() => setCfg({ ...cfg, cats: c })}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Ø¹Ø¯Ø¯ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©</Text>
        <View style={styles.chipsWrap}>
          {counts.map((n) => (
            <Chip
              key={n}
              label={n === 0 ? 'ÙƒÙ„ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©' : `${n} Ø³Ø¤Ø§Ù„`}
              active={cfg.count === n}
              onPress={() => setCfg({ ...cfg, count: n })}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Ø§Ù„ÙˆØ¶Ø¹</Text>
        <View style={styles.chipsWrap}>
          <Chip
            label="ÙˆØ¶Ø¹ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ (ØªØµØ­ÙŠØ­ ÙÙˆØ±ÙŠ)"
            active={cfg.mode === 'practice'}
            onPress={() => setCfg({ ...cfg, mode: 'practice' })}
          />
          <Chip
            label="ÙˆØ¶Ø¹ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù† (ØªØµØ­ÙŠØ­ ÙÙŠ Ø§Ù„Ù†Ù‡Ø§ÙŠØ©)"
            active={cfg.mode === 'exam'}
            onPress={() => setCfg({ ...cfg, mode: 'exam' })}
          />
        </View>

        <View style={styles.divider} />
        <SwitchRow
          label="Ø®Ù„Ø· ØªØ±ØªÙŠØ¨ Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ø¹Ø´ÙˆØ§Ø¦ÙŠØ§Ù‹"
          value={cfg.shuffleOptions}
          onValueChange={(v) => setCfg({ ...cfg, shuffleOptions: v })}
        />
        <SwitchRow label="Ø®Ù„Ø· ØªØ±ØªÙŠØ¨ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø¹Ø´ÙˆØ§Ø¦ÙŠØ§Ù‹" value disabled onValueChange={() => {}} />
        <SwitchRow
          label="Ù‚Ø±Ø§Ø¡Ø© ÙƒÙ„ Ø³Ø¤Ø§Ù„ ØµÙˆØªÙŠØ§Ù‹ Ø¹Ù†Ø¯ Ø¹Ø±Ø¶Ù‡"
          value={cfg.autoSpeak}
          onValueChange={(v) => setCfg({ ...cfg, autoSpeak: v })}
        />

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>ðŸŽ² ØªÙˆÙ„ÙŠØ¯ QCM Ø¹Ø´ÙˆØ§Ø¦ÙŠ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onOpenPdf} activeOpacity={0.8}>
          <Text style={styles.btnGhostText}>ðŸ“• Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù†Øµ Ø§Ù„ÙƒØ§Ù…Ù„ Ù„Ù„Ù‚Ø§Ù†ÙˆÙ† (PDF)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onOpenArticles} activeOpacity={0.8}>
          <Text style={styles.btnGhostText}>ðŸ“‘ Ù†ØµÙˆØµ Ø§Ù„Ù…ÙˆØ§Ø¯ ÙƒØ§Ù…Ù„Ø© (Ø¨Ø·Ø§Ù‚Ø© Ù„ÙƒÙ„ Ù…Ø§Ø¯Ø©)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Ø§Ù„Ø£Ø¬ÙˆØ¨Ø© Ù…Ø³ØªØ®Ø±Ø¬Ø© Ø¢Ù„ÙŠØ§Ù‹ ÙˆÙ…Ø±Ø§Ø¬ÙŽØ¹Ø© Ù…Ù† Ù†Øµ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ† Ø±Ù‚Ù… 58.25 Ø§Ù„Ù…ØªØ¹Ù„Ù‚ Ø¨Ø§Ù„Ù…Ø³Ø·Ø±Ø© Ø§Ù„Ù…Ø¯Ù†ÙŠØ©.
        {'\n'}Ø£Ø¯Ø§Ø© ØªØ¹Ù„ÙŠÙ…ÙŠØ© â€” ÙŠÙØ³ØªØ­Ø³Ù† Ø§Ù„Ø±Ø¬ÙˆØ¹ Ø¯Ø§Ø¦Ù…Ø§Ù‹ Ø¥Ù„Ù‰ Ø§Ù„Ù†Øµ Ø§Ù„Ø±Ø³Ù…ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: colors.bg },
  header: { alignItems: 'center', marginBottom: 14 },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  h2: { fontSize: 17, fontWeight: '800', color: colors.ink, textAlign: 'right' },
  hint: { fontSize: 12, color: colors.muted, marginTop: 4, textAlign: 'right' },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  chipsWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.ink, fontWeight: '600' },
  chipTextActive: { color: '#fff', fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
  switchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: { fontSize: 13, color: colors.ink, flex: 1, textAlign: 'right', marginStart: 12 },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  btnPrimary: { backgroundColor: colors.primary, marginTop: 20 },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnGhost: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: colors.line },
  btnGhostText: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  footer: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
  },
});

