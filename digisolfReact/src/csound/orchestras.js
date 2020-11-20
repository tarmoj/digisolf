export const dictationOrchestra = `
sr=44100
ksmps=128
0dbfs=1
nchnls=2

giNotes[] array 60, 65, 67, 62, 60
gaSignal[] init 2

gkBeatLength chnexport "beatLength", 1
gkVolume chnexport "volume", 1

gkBeatLength init 1
gkVolume init 1

;schedule "PlaySequence", 0, 10

instr PlaySequence ; plays the notes (MIDI NN) from array giNotes
iBeatLength init p4
;kMetroRate =1/gkBeatLength
kMetroRate =1/iBeatLength
kCounter init 0

printk2 kMetroRate

if (metro:k(kMetroRate)==1) then
schedulek "PlayNote", 0, 1, giNotes[kCounter]
kCounter += 1
printk2 kCounter
if (kCounter==lenarray(giNotes) ) then
turnoff
endif 
endif

endin


instr PlayNote ; p4 - notenumber
iNote = p4
Sfile sprintf "%d.ogg", iNote
prints Sfile
p3 filelen Sfile
aSignal[] diskin2 Sfile
aSignal *= gkVolume*linenr:a(1, 0.05,0.1, 0.001)
;aSignal[] init 2
;a1 poscil 0.3, cpsmidinn(iNote)
;aSignal[0] = poscil:a(0.3, cpsmidinn(iNote))
;aSignal[1] = aSignal[0]
gaSignal = aSignal
;TODO: check for channels
; TODO declick
out aSignal
endin

instr Stop
turnoff2 "PlaySequence", 0, 1
turnoff2 "PlayNote", 0, 1
turnoff
endin

schedule "Reverb", 0, -1
instr Reverb
iReverbLevel = 0.2
iSize = 0.6
aRvbL, aRvbR reverbsc gaSignal[0]*iReverbLevel , gaSignal[1]*iReverbLevel, iSize, 12000
out aRvbL, aRvbR
;clear gaSignal[0], gaSignal[1] 
gaSignal[0] = 0
gaSignal[1] = 0 
endin

`;

export const intonationOrchestra = `

sr = 44100 
ksmps = 32
nchnls = 2
0dbfs = 1
        
giSine ftgen 1,0, 16384, 10, 1 ; Sine
giSawtooth ftgen 2,0,  16384, 10, 1, 0.5, 0.3, 0.25, 0.2, 0.167, 0.14, 0.125, .111   ; Sawtooth
giSquare ftgen 3,  0, 16384, 10, 1, 0,   0.3, 0,    0.2, 0,     0.14, 0,     .111   ; Square

; parameters from p4 -  amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
instr PlayInterval
	iAmp = (p4==0) ? 0.2 : p4
	iFreq1 = cpsmidinn(p5) ; pich given as midi note
	iIntervalRatio = p6 ; frequency ratio from base note 1.5 - perfect fifth etc
	iCents = p7 ; deviation in cents, positive or negative 
	iFreq2 = iFreq1 * iIntervalRatio * cent(iCents)
	iSoundType = p8
	iPlayMelodic = p9
	iTable = (iSoundType >0 && iSoundType <=3) ? iSoundType : 1 
	 
	
	iDuration = (iPlayMelodic>0) ? p3/2 : p3
	iStart2 = (iPlayMelodic>0) ? iDuration : 0
	; think how to use samples of instruments
	iInstrument = nstrnum("Beep")
	
	schedule iInstrument, 0, iDuration, iAmp, iFreq1, iTable
	schedule iInstrument, iStart2, iDuration, iAmp, iFreq2,iTable 
endin


instr Beep
	iAmp = p4
	iFreq = p5
	iTable = p6	
	aEnvelope linen iAmp, 0.1, p3, 0.5
	aSignal poscil aEnvelope, iFreq, iTable
	outs aSignal, aSignal
endin

    `;
