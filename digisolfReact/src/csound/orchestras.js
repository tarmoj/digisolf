export const dictationOrchestra = `

sr=44100
ksmps=100
0dbfs=1
nchnls=2


giShort = 1
giLong = 2

giNotes[] array 60, 65, 67, 62, 60
gaSignal[] init 2

gkBeatLength chnexport "beatLength", 1
gkVolume chnexport "volume", 1

gkBeatLength init 1
gkVolume init 0.6


;schedule "PlaySequence", 0, 10

instr PlaySequence ; plays the notes (MIDI NN) from array giNotes
iBeatLength init p4
;kMetroRate =1/gkBeatLength
kMetroRate =1/iBeatLength
kCounter init 0

;printk2 kMetroRate

if (metro:k(kMetroRate)==1) then
schedulek "PlayNote", 0, 1, giNotes[kCounter]
kCounter += 1
;printk2 kCounter
if (kCounter==lenarray(giNotes) ) then
turnoff
endif 
endif

endin

; TODO: playInterval some pasting problems

;giNotes[] fillarray 60, 64, 67, 69
;schedule "PlayChord", 0, 0
instr PlayChord ; plays the notes (MIDI NN) from array giNotes as chord; middle ones softer
	
	index = 0
	iNotes = lenarray(giNotes)
	iAttenuation = 1/iNotes; ) *0.6 ; to avoid over 0
	while index<iNotes do
		if index==0 then
			iAmp = 1 ; lowest note strongest
		elseif index==iNotes-1 then ; last (uppermost) note a bit softer)
			iAmp = 0.8
		else 
			iAmp = 0.1 ; others softer
		endif
		schedule "PlayNote", random:i(0,0.05), giLong, giNotes[index], iAmp*iAttenuation ; beginning not exactly together
		index+=1
	od
	


endin


instr PlayNote ; p4 - notenumber
iNote = p4
iAmp = (p5==0) ? 1 : p5
print iAmp
;Sdir = "/home/tarmo/tarmo/programm/qt-projects/digi-solf/src/digisolfReact/public/sounds/instruments/guitar/"

;if (p3==giLong) then
;	Sfile sprintf "%s%d.ogg", Sdir, iNote ; NB! in the temporary file system I need some other way to name the long file.... like 61_long.ogg
;else 
;	Sfile sprintf "%d.ogg", Sdir, iNote
;endif
Sfile sprintf "%d.ogg", iNote
prints Sfile
;p3 filelen Sfile
aSignal[] diskin2 Sfile
aSignal *= gkVolume*linenr:a(0.5, 0.05,p3/2, 0.001)
gaSignal = aSignal
out aSignal
endin

schedule "Reverb", 0, -1
instr Reverb
iReverbLevel = 0.4
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

export const tuningOrchestra = `
sr = 44100 ; 
nchnls = 2
0dbfs = 1
ksmps = 32
A4=442

;;channesls
chn_k "interval", 1
chn_k "volume", 1
chn_k "octave",1
chn_k "step",1
chn_k "pitchratio",2
chn_k "tracking",1
chn_k "threshold", 1
chn_k "relativeRatio",3

chnset 8, "octave"
chnset 0.45, "volume"
chnset 0.05, "threshold"
chnset 1.5, "interval"

giSine ftgen 0,0, 32768, 10, 1, 0.05, 0.02, 0.002, 0.002, 0.001, 0.001
gkBaseFreq init 0
gkInterval init 0

; steps for s2,v3,s3,p4,p5,v6,v7,s7,p8
;giIntervals[] array 9/8, 6/5, 5/4, 4/3, 3/2, 8/5, 5/3, 7/4, 9/5, 15/8, 2 ; teine v7 on 9/5

;schedule "Analyze", 0, 1
instr Analyze

  kBaseFreq = cpspch(chnget:k("octave") + chnget:k("step")/100)
  kInterval = chnget:k("interval") ; must come in as a ratio already
  ;printk2 kInterval  
	
  ; values for meter:
  kmin = kInterval / 1.05 ; about semitone lower
  kmax = kInterval * 1.05 ; semitone higher
	
; pltrack -------------------
	ain inch 1
	ain butterhp ain, 100
	kcps, kamp  ptrack  ain, 2048
	kcps *= A4/440
	;kcps portk kcps, 0.02
	kamp = ampdb(kamp)
		
	if (kamp > (0.001 +chnget:k("threshold")*0.5)) then ; threshold between 0.001 .. 0.5
		kPitchRatio = kcps/kBaseFreq
		kPitchRatio port  kPitchRatio, 0.05 
		chnset kPitchRatio, "pitchratio";
		; convert to relative ratio min=0, max=1, correctRatio=0.5
		kRelativeRatio = (kPitchRatio-kmin) / (kmax-kmin)
		chnset kRelativeRatio, "relativeRatio"		
	endif
	
	; sound
	kVolume chnget "volume"
	kVolume port kVolume, 0.05
	
	aenv linenr 1, 0.1, 0.3, 0.001
	
	aBase poscil 0.6, kBaseFreq, giSine
	aInterval poscil 0.6, kBaseFreq * kInterval
	kIntervalAmp chnget "playInterval"
	kIntervalAmp port kIntervalAmp, 0.05

	asig =  (aBase + aInterval*kIntervalAmp ) * aenv * kVolume
	outs asig, asig
	
endin


`;
