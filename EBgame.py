"""
E-mode B-mode game

"""
import argparse
import time
import numpy as np
from numpy.fft import fftfreq, fft2, ifft2
from matplotlib import pyplot as plt
import tkinter as tk
from tkinter import messagebox as mbox

pad = 2

class EBGame:
    def __init__(self, fig, size=4):
        self.fig = fig
        self.size = size
        self.data = np.zeros((2, size, size))
        self.precalc()
        self.Ep = 0.
        self.Bp = 0.
        axposs = self.calc_axes_position()
        self.axs = []
        for axpos in axposs:
            self.axs.append(fig.add_axes(axpos))
        self.init_mainaxis()
        self.init_subaxes()
        self.selected = None
        self.overwrite = False
        self.showEB = 0
        self.mode = 'Human'
        self.PCturn = False
        self.finished = False
        self.winner = None
        self.update_mainaxis()
        self.update_subaxes()
        self.cid = fig.canvas.mpl_connect('button_press_event', self)

    def calc_axes_position(self):
        wf, hf = self.fig.get_size_inches()
        self.horizontal = wf > hf
        axposs = []
        if self.horizontal:
            space = hf * 0.02
            w1 = hf * 0.8
            h1 = hf * 0.8
            l1 = hf * 0.02 + (w1 - space * 3) / 4 + space
            b1 = hf * 0.1
            r1 = l1 + w1
            t1 = b1 + h1
            a1 = [l1 / wf, b1 / hf, w1 / wf, h1 / hf]
            axposs.append(a1)
            b2 = t1 + space
            for i in range(4):
                w2 = (w1 - space * 3) / 4
                h2 = (w1 - space * 3) / 4
                l2 = r1 + space
                r2 = l2 + w2
                t2 = b2 - space
                b2 = t2 - h2
                a2 = [l2 / wf, b2 / hf, w2 / wf, h2 / hf]
                axposs.append(a2)
            w3 = hf * 0.05
            h3 = h1
            l3 = r2 + space
            r3 = l3 + w3
            b3 = b1
            a3 = [l3 / wf, b3 / hf, w3 / wf, h3 / hf]
            axposs.append(a3)
            b2 = t1 + space
            for i in range(4):
                w2 = (w1 - space * 3) / 4
                h2 = (w1 - space * 3) / 4
                r2 = l1 - space
                l2 = r2 - w2
                t2 = b2 - space
                b2 = t2 - h2
                a2 = [l2 / wf, b2 / hf, w2 / wf, h2 / hf]
                axposs.append(a2)
        else:
            space = wf * 0.02
            w1 = wf*0.8
            h1 = wf*0.8
            l1 = wf*0.1
            t1 = hf - wf*0.05 - (h1 - space * 3) / 4
            r1 = l1 + w1
            b1 = t1 - h1
            a1 = [l1/wf,b1/hf,w1/wf,h1/hf]
            axposs.append(a1)
            l2 = r1 + space
            for i in range(4):
                w2 = (h1 - space * 3) / 4
                h2 = (h1 - space * 3) / 4
                r2 = l2 - space
                l2 = r2 - w2
                t2 = b1 - space
                b2 = t2 - h2
                a2 = [l2 / wf, b2 / hf, w2 / wf, h2 / hf]
                axposs.append(a2)
            h3 = wf*0.05
            w3 = w1
            l3 = l1
            t3 = b2 - space
            b3 = t3 - h3
            a3 = [l3 / wf, b3 / hf, w3 / wf, h3 / hf]
            axposs.append(a3)
            l2 = r1 + space
            for i in range(4):
                w2 = (h1 - space * 3) / 4
                h2 = (h1 - space * 3) / 4
                r2 = l2 - space
                l2 = r2 - w2
                b2 = t1 + space
                t2 = b2 + h2
                a2 = [l2 / wf, b2 / hf, w2 / wf, h2 / hf]
                axposs.append(a2)
        return axposs

    def update_axes_position(self):
        axposs = self.calc_axes_position()
        for ax, axpos in zip(self.axs, axposs):
            ax.set_position(axpos)

    def init_subaxes(self):
        for i, ax in enumerate(self.axs[1:5]):
            ax.axis([-1,1,-1,1])
            angle = np.pi * i / 4
            ax.plot([-np.cos(angle), np.cos(angle)],
                    [-np.sin(angle), np.sin(angle)],
                    'k-', lw=6)
            ax.set_xticks([])
            ax.set_yticks([])
        for i, ax in enumerate(self.axs[6:10]):
            ax.axis([-1,1,-1,1])
            ax.set_xticks([])
            ax.set_yticks([])
            button = ['Reset', 'Human', 'PC1', 'PC2'][i]
            ax.annotate(button, [0,0], fontsize='large',va='center',ha='center')

    def update_subaxes(self):
        for i, qu in enumerate('QUqu'):
            if self.selected == qu:
                self.axs[i+1].set_facecolor('r')
            else:
                self.axs[i+1].set_facecolor('w')
        for i, mode in enumerate(['Human','PC1','PC2']):
            if self.mode == mode:
                self.axs[i+7].set_facecolor('r')
            else:
                self.axs[i+7].set_facecolor('w')
        self.update_meter()

    def init_mainaxis(self):
        ax = self.axs[0]
        ax.axis([-0.5, self.data.shape[2]-0.5, -0.5, self.data.shape[1]-0.5])
        ax.set_xticks(np.arange(self.data.shape[2]+1)-0.5)
        ax.set_xticklabels([])
        ax.set_yticks(np.arange(self.data.shape[1]+1)-0.5)
        ax.set_yticklabels([])
        ax.tick_params(length=0)
        ax.grid()

    def update_mainaxis(self, finished=False):
        ax = self.axs[0]
        ax.clear()
        self.init_mainaxis()
        lines = []
        for iy in range(self.data.shape[1]):
            for ix in range(self.data.shape[2]):
                q, u = self.data[:, iy, ix]
                if q == 0 and u == 0:
                    continue
                angle = np.arctan2(u,q)/2
                dx = 0.5*np.cos(angle)*np.array([-1,1])
                dy = 0.5*np.sin(angle)*np.array([-1,1])
                l = ax.plot(ix + dx, iy + dy, 'k-', lw=2)
                lines.append(l)
        self.calc_EB()
        if not finished:
            self.check_finish()

    def update_data(self, event):
        x, y = event.xdata, event.ydata
        ix = int(np.round(x))
        iy = int(np.round(y))
        if self.selected is None:
            return 1
        elif (not self.overwrite) and (self.data[:, iy, ix] != 0).any():
            return 2
        elif self.selected == 'Q':
            self.data[:, iy, ix] = np.array([1, 0])
        elif self.selected == 'q':
            self.data[:, iy, ix] = np.array([-1, 0])
        elif self.selected == 'U':
            self.data[:, iy, ix] = np.array([0, 1])
        elif self.selected == 'u':
            self.data[:, iy, ix] = np.array([0, -1])
        self.selected = None
        return 0

    def precalc(self):
        size = self.size * pad
        ly, lx = np.meshgrid(fftfreq(size), fftfreq(size))
        self.psi = np.arctan2(ly, lx)
        self.psi[0,0]=0
        self.qu2 = np.zeros((size, size), dtype=complex)

    def calc_EB(self):
        size = self.size
        size2 = size * pad
        self.qu2[:] = 0.
        self.qu2[:size,:size] = self.data[0] + 1j*self.data[1]
        s = np.roll(np.arange(size2), -(size//2))
        sinv = np.roll(np.arange(size2), (size//2))
        fqu = fft2(self.qu2[s].T[s].T)
        fqu[0,0]=0.
        if size2%2==0:
            fqu[:,size2//2] = 0.
            fqu[size2//2,:] = 0.
        feb = (fqu) * np.exp(2j * self.psi)
        eb = ifft2(feb)[sinv].T[sinv].T[:size,:size]
        if self.showEB == 1:
            self.axs[0].imshow(eb.real,vmin=-1,vmax=1,interpolation='hanning')
        elif self.showEB == -1:
            self.axs[0].imshow(eb.imag, cmap=plt.cm.magma, vmin=-1,vmax=1,interpolation='hanning')
        else:
            pass
        self.Ep = (eb.real*eb.real).sum()
        self.Bp = (eb.imag*eb.imag).sum()
        print('E', self.Ep, np.abs(eb.real).max())
        print('B', self.Bp, np.abs(eb.imag).max())
        self.update_meter()

    def update_meter(self):
        e, b = self.Ep, self.Bp
        ax = self.axs[5]
        ax.clear()
        ax.axis([0,1,0,1])
        ax.set_xticks([])
        ax.set_yticks([])
        Efontsize = Bfontsize = 16
        if self.showEB == 1:
            Efontsize = 20
        elif self.showEB == -1:
            Bfontsize = 20
        if self.horizontal:
            if (e == 0 and b == 0) or (self.showEB == 0):
                pass
            else:
                ax.axhspan(0, b / (e + b), color=plt.cm.magma(0.5))
                ax.axhspan(b / (e + b), 1, color=plt.cm.viridis(0.5))
            ax.axhline(0.5, ls='-', color='k', alpha=0.5)
            ax.annotate("E-mode",(0.5, 0.97), fontsize=Efontsize, ha='center', va='top',
                        rotation=90, clip_on=False)
            ax.annotate("B-mode",(0.5, 0.03), fontsize=Bfontsize, ha='center', va='bottom',
                        rotation=90, clip_on=False)
        else:
            if (e == 0 and b == 0) or (self.showEB == 0):
                pass
            else:
                ax.axvspan(0, b / (e + b), color=plt.cm.magma(0.5))
                ax.axvspan(b / (e + b), 1, color=plt.cm.viridis(0.5))
            ax.axvline(0.5, ls='-', color='k', alpha=0.5)
            ax.annotate("E-mode",(0.97, 0.5), fontsize=Efontsize, ha='right', va='center',
                        rotation=0, clip_on=False)
            ax.annotate("B-mode",(0.03, 0.5), fontsize=Bfontsize, ha='left', va='center',
                        rotation=0, clip_on=False)

    def check_finish(self):
        if not (self.data==0).all(axis=0).any() and not self.finished and self.winner is None:
            self.finished = True
            if self.Ep > self.Bp:
                self.winner = 'E'
                self.showEB = 1
            else:
                self.winner = 'B'
                self.showEB = -1
            self.update_mainaxis()

    def check_PC(self):
        if self.mode.startswith('PC'):
            self.update_axes_position()
            self.update_subaxes()
            self.fig.canvas.draw()
            self.PC1_turn()

    def PC1_turn(self):
        y, x = np.where((self.data==0).all(axis=0))
        if len(x) == 0:
            return
        self.PCturn = True
        time.sleep(1)
        i = np.random.rand(len(x)).argsort()[0]
        event = argparse.Namespace()
        event.xdata = x[i]
        event.ydata = y[i]
        pol = int(np.floor(np.random.rand()*4))%4
        self.selected = 'QUqu'[pol]
        self.update_data(event)
        self.update_mainaxis()
        self.PCturn = False

    def __call__(self, event):
        if self.PCturn:
            return
        if event.inaxes == self.axs[0]:
            ret = self.update_data(event)
            self.update_mainaxis()
            if ret == 0:
                self.check_PC()
        elif event.inaxes == self.axs[5]:
            self.showEB += 1
            if self.showEB > 1:
                self.showEB = -1
            self.update_mainaxis(finished=True)
        elif event.inaxes is not None:
            self.overwrite = event.dblclick
            if event.inaxes == self.axs[1]:
                self.selected = 'Q'
            elif event.inaxes == self.axs[2]:
                self.selected = 'U'
            elif event.inaxes == self.axs[3]:
                self.selected = 'q'
            elif event.inaxes == self.axs[4]:
                self.selected = 'u'
            elif event.inaxes == self.axs[6]:
                self.data[:] = 0
                self.showEB = 0
                self.selected = None
                self.winner = None
                self.update_mainaxis()
            elif (self.data.sum(axis=0) != 0).all() or (self.data == 0).all() or event.dblclick:
                self.data[:] = 0
                self.showEB = 0
                self.selected = None
                self.winner = None
                if event.inaxes == self.axs[7]:
                    self.mode = 'Human'
                elif event.inaxes == self.axs[8]:
                    self.mode = 'PC1'
                    if np.random.rand() > 0.5:
                        self.check_PC()
                elif event.inaxes == self.axs[9]:
                    self.mode = 'PC2'
                    if np.random.rand() > 0.5:
                        self.check_PC()
                self.update_mainaxis()
        else:
            self.selected = None
        self.update_axes_position()
        self.update_subaxes()
        self.fig.canvas.draw()
        if self.finished and self.winner is not None:
            mbox.showinfo('Result', self.winner + '-mode win!!')
            self.finished = False


parser = argparse.ArgumentParser(usage="python EBgame.py", description="E-mode B-mode game")
parser.add_argument('--size', type=int, default=4, help="Size of board (default=4)")
args = parser.parse_args()
fig = plt.figure()
game = EBGame(fig, size=args.size)
plt.show()
