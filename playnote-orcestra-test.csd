<CsoundSynthesizer>
<CsOptions>
-odac -d
--env:SFDIR="/home/tarmo/tarmo/programm/qt-projects/digi-solf/src/digisolfReact/public/sounds/instruments/violin/"

</CsOptions>
<CsInstruments>

sr=44100
ksmps=128
0dbfs=1
nchnls=2


#define SHORT #1# ; for quarter notes
#define LONG #2# ; for 2-beat notes

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

giNotes[] fillarray 60, 64, 67, 69
schedule "PlayChord", 0, 0
instr PlayChord ; plays the notes (MIDI NN) from array giNotes as chord; middle ones softer
	
	index = 0
	iNotes = lenarray(giNotes)
	iAttenuation = 1/sqrt(iNotes) ; to avoid over 0
	while index<iNotes do
		if index==0 then
			iAmp = 1 ; lowest note strongest
		elseif index==iNotes-1 then ; last (uppermost) note a bit softer)
			iAmp = 0.8
		else 
			iAmp = 0.1 ; others softer
		endif
		schedule "PlayNote", random:i(0,0.05), $LONG, giNotes[index], iAmp*iAttenuation ; beginning not exactly together
		index+=1
	od
	


endin

;schedule "PlayInterval", 0, 1, 60, 67, 0
instr PlayInterval ; p4, p5, interval in MIDI notes, p6 - if melodic, 0 - play harmoniically
	iNote1 = p4
	iNote2 = p5
	iMelodic = p6
	
	iDuration = 2*i(gkBeatLength)
	
	if (iMelodic>=1) then
		iDuration = i(gkBeatLength)
		schedule "PlayNote", 0, $SHORT, iNote1, 1
		schedule "PlayNote", iDuration, $SHORT, iNote2, 0.6
	else
		iDuration = 2*i(gkBeatLength)
		schedule "PlayNote", 0, $LONG, iNote1, 0.8
		schedule "PlayNote", 0, $LONG, iNote2, 0.4
	endif
	
endin


instr PlayNote ; p4 - notenumber
iNote = p4
iAmp = (p5==0) ? 1 : p5
print iAmp
Sdir = "/home/tarmo/tarmo/programm/qt-projects/digi-solf/src/digisolfReact/public/sounds/instruments/guitar/"
if (p3==$LONG) then
	Sfile sprintf "%s/2sec/%d.ogg", Sdir, iNote ; NB! in the temporary file system I need some other way to name the long file.... like 61_long.ogg
else 
	Sfile sprintf "%s/%d.ogg", Sdir, iNote
endif
;prints Sfile
;p3 filelen Sfile
aSignal[] diskin2 Sfile
aSignal *= gkVolume*linenr:a(1, 0.05,0.1, 0.001)
gaSignal = aSignal
out aSignal
endin

instr Stop
turnoff2 "PlaySequence", 0, 1
turnoff2 "PlayNote", 0, 1
turnoff
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

</CsInstruments>
<CsScore>

</CsScore>
</CsoundSynthesizer>
<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>0</x>
 <y>0</y>
 <width>0</width>
 <height>0</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="nobackground">
  <r>255</r>
  <g>255</g>
  <b>255</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>
