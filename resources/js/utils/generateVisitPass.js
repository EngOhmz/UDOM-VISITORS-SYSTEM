import { jsPDF } from 'jspdf';

const UDOM_BLUE = [0, 96, 204];
const UDOM_DARK = [0, 46, 99];
const UDOM_GOLD = [242, 169, 0];
const PASS_WIDTH = 85;
const PASS_HEIGHT = 118;

async function loadImageData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

function getAvatarUrl(visitor) {
    if (visitor?.avatar) {
        return visitor.avatar.startsWith('http')
            ? visitor.avatar
            : `${window.location.origin}${visitor.avatar}`;
    }
    const name = encodeURIComponent(visitor?.name || 'Visitor');
    return `https://ui-avatars.com/api/?name=${name}&background=0060cc&color=fff&size=200&bold=true`;
}

function truncate(text, max = 24) {
    const str = String(text || 'N/A');
    return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

export async function generateVisitPass(request) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [PASS_WIDTH, PASS_HEIGHT],
    });

    const w = PASS_WIDTH;
    const h = PASS_HEIGHT;

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, h, 'F');

    // Outer border
    doc.setDrawColor(...UDOM_GOLD);
    doc.setLineWidth(0.5);
    doc.roundedRect(2, 2, w - 4, h - 4, 2.5, 2.5, 'S');

    // Header band
    doc.setFillColor(...UDOM_DARK);
    doc.rect(4, 4, w - 8, 20, 'F');
    doc.setFillColor(...UDOM_GOLD);
    doc.rect(4, 24, w - 8, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('UDOM VISITOR PASS', w / 2, 11, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 220, 245);
    doc.text('University of Dodoma', w / 2, 16, { align: 'center' });
    doc.setFontSize(5.5);
    doc.text('Visitor Management System', w / 2, 20.5, { align: 'center' });

    // Profile photo
    const photoX = 8;
    const photoY = 29;
    const photoSize = 22;
    const imageData = await loadImageData(getAvatarUrl(request.visitor));

    doc.setFillColor(239, 246, 255);
    doc.roundedRect(photoX, photoY, photoSize, photoSize, 2, 2, 'F');
    doc.setDrawColor(...UDOM_GOLD);
    doc.setLineWidth(0.5);
    doc.roundedRect(photoX, photoY, photoSize, photoSize, 2, 2, 'S');

    if (imageData) {
        try {
            doc.addImage(imageData, 'JPEG', photoX + 0.5, photoY + 0.5, photoSize - 1, photoSize - 1);
        } catch {
            // keep placeholder background
        }
    }

    // Visitor details beside photo
    const textX = photoX + photoSize + 5;
    let y = 33;

    doc.setTextColor(...UDOM_DARK);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(truncate(request.visitor?.name, 20), textX, y);

    y += 5.5;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);

    const details = [
        ['Office', request.office?.name],
        ['Date', new Date(request.visit_date).toLocaleDateString()],
        ...(request.visit_time ? [['Time', request.visit_time]] : []),
        ...(request.visitor?.organization ? [['Org', request.visitor.organization]] : []),
    ];

    details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...UDOM_BLUE);
        doc.text(`${label}:`, textX, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(truncate(value, 16), textX + 11, y);
        y += 4.5;
    });

    // Purpose block
    const purposeY = 58;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.2);
    doc.roundedRect(6, purposeY, w - 12, 13, 1.5, 1.5, 'FD');
    doc.setFontSize(5);
    doc.setTextColor(...UDOM_BLUE);
    doc.setFont('helvetica', 'bold');
    doc.text('PURPOSE OF VISIT', 8, purposeY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(50, 50, 50);
    const purposeLines = doc.splitTextToSize(request.purpose || '-', w - 16);
    doc.text(purposeLines.slice(0, 2), 8, purposeY + 8.5);

    // Verification code
    const codeY = 74;
    doc.setFillColor(...UDOM_BLUE);
    doc.roundedRect(6, codeY, w - 12, 22, 2.5, 2.5, 'F');
    doc.setFillColor(...UDOM_GOLD);
    doc.rect(6, codeY, w - 12, 1.2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFICATION CODE', w / 2, codeY + 6, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('courier', 'bold');
    doc.text(request.verification_code, w / 2, codeY + 15, { align: 'center' });

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(110, 110, 110);
    doc.text('Present this pass at campus reception upon arrival', w / 2, h - 9, { align: 'center' });
    doc.setTextColor(...UDOM_BLUE);
    doc.text(`Issued ${new Date().toLocaleDateString()} · Valid for scheduled visit only`, w / 2, h - 5, { align: 'center' });

    doc.save(`UDOM-Visit-Pass-${request.verification_code}.pdf`);
}
