<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillPath Certificate</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #0f172a;
        }
        /* --- PAGE 1: CERTIFICATE --- */
        .page {
            width: 297mm;
            height: 210mm;
            position: relative;
            box-sizing: border-box;
            overflow: hidden;
            page-break-after: always;
            background-color: #ffffff;
            z-index: 0;
        }
        .bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #f8fafc;
            z-index: 1;
        }
        .accent-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 15mm;
            background-color: #4f46e5; /* Primary Indigo */
            z-index: 2;
        }
        .accent-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 15mm;
            background-color: #0f172a; /* Slate 900 */
            z-index: 2;
        }
        .accent-polygon {
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background-color: #e0e7ff; /* Indigo 100 */
            border-bottom-left-radius: 300px;
            z-index: 2;
        }
        .accent-polygon-2 {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 400px;
            height: 400px;
            background-color: #f1f5f9; /* Slate 100 */
            border-top-right-radius: 400px;
            z-index: 2;
        }
        .content {
            position: absolute;
            top: 25mm;
            left: 20mm;
            right: 20mm;
            z-index: 10;
            text-align: center;
        }
        .logo-text {
            font-size: 16pt;
            font-weight: bold;
            color: #4f46e5;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }
        .cert-title {
            font-family: 'Georgia', serif;
            font-size: 48pt;
            font-weight: normal;
            color: #0f172a;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 6px;
        }
        .cert-subtitle {
            font-size: 14pt;
            color: #64748b;
            letter-spacing: 4px;
            margin-top: 5px;
            margin-bottom: 30px;
        }
        .presented-to {
            font-size: 12pt;
            color: #475569;
            margin-bottom: 10px;
        }
        .student-name {
            font-family: 'Georgia', serif;
            font-size: 40pt;
            color: #4f46e5;
            font-style: italic;
            border-bottom: 2px solid #cbd5e1;
            display: inline-block;
            padding: 0 40px 10px 40px;
            margin-bottom: 25px;
        }
        .completion-text {
            font-size: 14pt;
            color: #334155;
            margin-bottom: 10px;
        }
        .course-name {
            font-size: 24pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 30px;
        }
        .footer-table {
            width: 100%;
            margin-top: 20px;
        }
        .footer-col {
            width: 33.33%;
            vertical-align: bottom;
            text-align: center;
        }
        .signature-line {
            width: 200px;
            border-bottom: 1px solid #0f172a;
            margin: 0 auto 10px auto;
        }
        .signature-text {
            font-size: 11pt;
            font-weight: bold;
            color: #0f172a;
        }
        .signature-title {
            font-size: 9pt;
            color: #64748b;
        }
        .seal-container {
            width: 100px;
            height: 100px;
            background-color: #fbbf24; /* Amber 400 */
            border-radius: 50px;
            margin: 0 auto;
            border: 4px dashed #b45309;
            text-align: center;
        }
        .seal-text {
            font-size: 9pt;
            font-weight: bold;
            color: #78350f;
            text-align: center;
            line-height: 1.2;
            padding-top: 35px;
        }

        /* --- PAGE 2: TRANSCRIPT --- */
        .transcript-page {
            position: relative;
            box-sizing: border-box;
            padding: 20mm;
            background-color: #ffffff;
            page-break-after: avoid; /* Don't break after last page */
        }
        .transcript-header {
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .transcript-title {
            font-size: 28pt;
            font-family: 'Georgia', serif;
            color: #0f172a;
            margin: 0;
        }
        .transcript-subtitle {
            font-size: 12pt;
            color: #64748b;
            margin-top: 5px;
        }
        .info-grid {
            width: 100%;
            margin-bottom: 30px;
        }
        .info-cell {
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #4f46e5;
        }
        .info-label {
            font-size: 10pt;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 14pt;
            color: #0f172a;
            font-weight: bold;
        }
        .score-box {
            background-color: #4f46e5;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .score-label {
            font-size: 10pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .score-value {
            font-size: 32pt;
            font-weight: bold;
        }
        .feedback-container {
            margin-top: 20px;
        }
        .feedback-heading {
            font-size: 16pt;
            color: #0f172a;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .feedback-item {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .feedback-item-label {
            font-size: 12pt;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 8px;
        }
        .feedback-item-text {
            font-size: 11pt;
            color: #334155;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <!-- PAGE 1: CERTIFICATE OF COMPLETION -->
    <div class="page">
        <div class="bg-pattern"></div>
        <div class="accent-top"></div>
        <div class="accent-bottom"></div>
        <div class="accent-polygon"></div>
        <div class="accent-polygon-2"></div>
        
        <div class="content">
            <div class="logo-text">SKILLPATH</div>
            
            <h1 class="cert-title">Certificate</h1>
            <div class="cert-subtitle">OF COMPLETION</div>
            
            <div class="presented-to">This is proudly presented to</div>
            
            <div class="student-name">{{ $user_name }}</div>
            
            <div class="completion-text">for successfully completing the learning roadmap and demonstrating proficiency in</div>
            
            <div class="course-name">{{ $roadmap_title }}</div>
            
            <table class="footer-table">
                <tr>
                    <td class="footer-col">
                        <div class="signature-line"></div>
                        <div class="signature-text">Ahmad Faqih Arrifa'i</div>
                        <div class="signature-title">SkillPath CEO</div>
                    </td>
                    <td class="footer-col">
                        <div class="seal-container">
                            <div class="seal-text">VERIFIED<br>ACHIEVEMENT</div>
                        </div>
                    </td>
                    <td class="footer-col">
                        <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">{{ $date }}</div>
                        <div class="signature-line" style="width: 150px;"></div>
                        <div class="signature-title">Date of Issue</div>
                        <div style="font-size: 8pt; color: #94a3b8; margin-top: 5px;">ID: SP-{{ strtoupper(substr(md5($roadmap_title . $user_name), 0, 8)) }}</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- PAGE 2: TRANSCRIPT & FEEDBACK -->
    @if($feedback)
    <div class="transcript-page">
        <div class="transcript-header">
            <h2 class="transcript-title">Performance Transcript</h2>
            <div class="transcript-subtitle">SkillPath Evaluation Report</div>
        </div>

        <table style="width: 100%; border-collapse: separate; border-spacing: 15px; margin-top: -15px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div class="info-cell">
                        <div class="info-label">Learner Name</div>
                        <div class="info-value">{{ $user_name }}</div>
                    </div>
                </td>
                <td style="width: 25%; vertical-align: top;">
                    <div class="info-cell">
                        <div class="info-label">Roadmap Topic</div>
                        <div class="info-value" style="font-size: 11pt;">{{ $roadmap_title }}</div>
                    </div>
                </td>
                <td style="width: 25%; vertical-align: top;">
                    <div class="info-cell">
                        <div class="info-label">Completion Date</div>
                        <div class="info-value" style="font-size: 11pt;">{{ $completed_at }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <div style="width: 250px; margin: 30px auto;">
            <div class="score-box">
                <div class="score-label">Final Assessment Score</div>
                <div class="score-value">{{ $score }} / 100</div>
            </div>
        </div>

        <div class="feedback-container">
            <div class="feedback-heading">AI Evaluation Details</div>
            
            <div class="feedback-item">
                <div class="feedback-item-label">Appreciation (Apresiasi)</div>
                <div class="feedback-item-text">{{ $feedback->apresiasi }}</div>
            </div>
            
            <div class="feedback-item">
                <div class="feedback-item-label">Performance Analysis (Analisis)</div>
                <div class="feedback-item-text">{{ $feedback->analisis }}</div>
            </div>
            
            <div class="feedback-item">
                <div class="feedback-item-label">Motivational Insight (Pesan Motivasi)</div>
                <div class="feedback-item-text">{{ $feedback->pesan_motivasi }}</div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; font-size: 9pt; color: #94a3b8;">
            This transcript is generated automatically by SkillPath.<br>
            Certificate ID: SP-{{ strtoupper(substr(md5($roadmap_title . $user_name), 0, 8)) }}
        </div>
    </div>
    @endif
</body>
</html>
